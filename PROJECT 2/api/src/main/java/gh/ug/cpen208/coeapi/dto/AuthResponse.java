package gh.ug.cpen208.coeapi.dto;

/** Response for register/login: a JWT plus the student profile. */
public record AuthResponse(
        String token,
        StudentDto student
) {}
