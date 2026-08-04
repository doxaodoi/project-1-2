package gh.ug.cpen208.coeapi.dto;

/** Payload for POST /api/auth/login. */
public record LoginRequest(
        String email,
        String password
) {}
