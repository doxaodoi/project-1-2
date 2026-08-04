package gh.ug.cpen208.coeapi.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** A single fee payment (functionality 2). */
public record PaymentDto(
        long paymentId,
        BigDecimal amount,
        LocalDate paidOn,
        String method,
        String reference
) {}
