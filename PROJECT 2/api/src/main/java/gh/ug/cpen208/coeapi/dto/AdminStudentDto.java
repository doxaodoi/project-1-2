package gh.ug.cpen208.coeapi.dto;

import java.math.BigDecimal;

/** A class-roster row for the admin console: student + fee position. */
public record AdminStudentDto(
        long studentId,
        String fullName,
        String email,
        String phone,
        int level,
        BigDecimal totalBilled,
        BigDecimal totalPaid,
        BigDecimal outstanding
) {}
