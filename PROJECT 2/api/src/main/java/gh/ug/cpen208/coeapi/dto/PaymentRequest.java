package gh.ug.cpen208.coeapi.dto;

import java.math.BigDecimal;

/** A fee payment the student wants to make (functionality 2). */
public record PaymentRequest(BigDecimal amount, String method) {}
