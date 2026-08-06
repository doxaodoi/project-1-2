package gh.ug.cpen208.coeapi.dto;

/**
 * Response for register/login: a JWT plus the caller's role and display name.
 * {@code student} is the student profile for STUDENT accounts and null for ADMIN accounts.
 */
public record AuthResponse(
        String token,
        String role,
        String displayName,
        StudentDto student
) {}
