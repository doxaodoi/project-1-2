package gh.ug.cpen208.coeapi.dto;

/** Payload for POST /api/auth/register. */
public record RegisterRequest(
        Long studentId,
        String fullName,
        String email,
        String password
) {}
