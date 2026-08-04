package gh.ug.cpen208.coeapi.dto;

import java.math.BigDecimal;

/** A student's billed/paid/outstanding summary (functionality 2). */
public record OutstandingDto(
        long studentId,
        String fullName,
        BigDecimal totalBilled,
        BigDecimal totalPaid,
        BigDecimal outstanding
) {}
