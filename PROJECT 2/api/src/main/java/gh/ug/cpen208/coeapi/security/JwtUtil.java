package gh.ug.cpen208.coeapi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Minimal HS256 JSON Web Token implementation using only the JDK
 * (javax.crypto HMAC-SHA256 + Base64URL) and Jackson for JSON.
 *
 * A dedicated JWT library (e.g. jjwt) is intentionally avoided so the API
 * builds fully offline; the token format is standard so any JWT tool can
 * decode it.
 */
@Component
public class JwtUtil {

    private static final String HEADER_JSON = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
    private final Base64.Encoder b64 = Base64.getUrlEncoder().withoutPadding();
    private final Base64.Decoder b64d = Base64.getUrlDecoder();
    private final ObjectMapper mapper = new ObjectMapper();

    private final byte[] secret;
    private final long expiryMillis;

    public JwtUtil(@Value("${app.jwt.secret}") String secret,
                   @Value("${app.jwt.expiry-minutes}") long expiryMinutes) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expiryMillis = expiryMinutes * 60_000L;
    }

    /** Immutable view of the token's identity claims. studentId is 0 for non-student (admin) tokens. */
    public record Claims(long studentId, String email, String role) {}

    public String generateToken(long studentId, String email, String role) {
        long now = System.currentTimeMillis() / 1000L;
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", String.valueOf(studentId));
        payload.put("email", email);
        payload.put("role", role);
        payload.put("iat", now);
        payload.put("exp", now + expiryMillis / 1000L);

        String headerPart = encode(HEADER_JSON.getBytes(StandardCharsets.UTF_8));
        String payloadPart = encode(toJson(payload).getBytes(StandardCharsets.UTF_8));
        String signingInput = headerPart + "." + payloadPart;
        String signature = encode(hmac(signingInput));
        return signingInput + "." + signature;
    }

    /**
     * Validates the signature and expiry and returns the claims.
     * @throws JwtException when the token is malformed, tampered with or expired.
     */
    public Claims validate(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new JwtException("Malformed token");
        }
        String signingInput = parts[0] + "." + parts[1];
        byte[] expected = hmac(signingInput);
        byte[] provided = b64d.decode(parts[2]);
        if (!MessageDigest.isEqual(expected, provided)) {
            throw new JwtException("Invalid signature");
        }
        Map<?, ?> payload;
        try {
            payload = mapper.readValue(b64d.decode(parts[1]), Map.class);
        } catch (Exception e) {
            throw new JwtException("Unreadable payload");
        }
        long exp = ((Number) payload.get("exp")).longValue();
        if (System.currentTimeMillis() / 1000L >= exp) {
            throw new JwtException("Token expired");
        }
        long studentId = Long.parseLong(String.valueOf(payload.get("sub")));
        String email = String.valueOf(payload.get("email"));
        Object roleClaim = payload.get("role");
        String role = roleClaim == null ? "STUDENT" : String.valueOf(roleClaim);
        return new Claims(studentId, email, role);
    }

    private String encode(byte[] bytes) {
        return b64.encodeToString(bytes);
    }

    private String toJson(Map<String, Object> map) {
        try {
            return mapper.writeValueAsString(map);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to serialise JWT payload", e);
        }
    }

    private byte[] hmac(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("Unable to sign JWT", e);
        }
    }

    /** Thrown when a token fails validation. */
    public static class JwtException extends RuntimeException {
        public JwtException(String message) { super(message); }
    }
}
