package gh.ug.cpen208.coeapi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Protects the data endpoints. Everything under /api/** requires a valid
 * "Authorization: Bearer &lt;token&gt;" header EXCEPT the public /api/auth/**
 * routes. On success the authenticated student id/email are exposed as request
 * attributes for controllers to read.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    public static final String ATTR_STUDENT_ID = "authStudentId";
    public static final String ATTR_EMAIL = "authEmail";

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        // Only guard /api/**, and leave the auth endpoints + CORS pre-flight open.
        if (!path.startsWith("/api/")) return true;
        if (path.startsWith("/api/auth/")) return true;
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            unauthorized(response, "Missing bearer token");
            return;
        }
        try {
            JwtUtil.Claims claims = jwtUtil.validate(header.substring(7).trim());
            request.setAttribute(ATTR_STUDENT_ID, claims.studentId());
            request.setAttribute(ATTR_EMAIL, claims.email());
        } catch (JwtUtil.JwtException e) {
            unauthorized(response, e.getMessage());
            return;
        }
        chain.doFilter(request, response);
    }

    private void unauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"" + message + "\"}");
    }
}
