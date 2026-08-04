package gh.ug.cpen208.coeapi.dto;

import java.time.LocalDate;

/** Student personal information (functionality 1). */
public record StudentDto(
        long studentId,
        String fullName,
        String email,
        String phone,
        LocalDate dateOfBirth,
        int level,
        String program
) {}
