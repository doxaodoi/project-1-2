package gh.ug.cpen208.coeapi.repository;

import gh.ug.cpen208.coeapi.dto.OutstandingDto;
import gh.ug.cpen208.coeapi.dto.PaymentDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class FeesRepository {

    private final JdbcTemplate jdbc;

    public FeesRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<PaymentDto> PAYMENT_MAPPER = (rs, i) -> new PaymentDto(
            rs.getLong("payment_id"),
            rs.getBigDecimal("amount"),
            rs.getObject("paid_on", LocalDate.class),
            rs.getString("method"),
            rs.getString("reference")
    );

    private static final RowMapper<OutstandingDto> OUTSTANDING_MAPPER = (rs, i) -> new OutstandingDto(
            rs.getLong("student_id"),
            rs.getString("full_name"),
            rs.getBigDecimal("total_billed"),
            rs.getBigDecimal("total_paid"),
            rs.getBigDecimal("outstanding")
    );

    public List<PaymentDto> findPayments(long studentId) {
        return jdbc.query(
                "SELECT payment_id, amount, paid_on, method, reference " +
                "FROM finance.payments WHERE student_id = ? ORDER BY paid_on",
                PAYMENT_MAPPER, studentId);
    }

    /** Billed/paid/outstanding for one student; outstanding uses the Project 1 DB function. */
    public Optional<OutstandingDto> getOutstanding(long studentId) {
        String sql =
                "SELECT s.student_id, s.full_name, " +
                "  COALESCE((SELECT SUM(amount_due) FROM finance.fee_bills WHERE student_id = s.student_id), 0) AS total_billed, " +
                "  COALESCE((SELECT SUM(amount)     FROM finance.payments  WHERE student_id = s.student_id), 0) AS total_paid, " +
                "  finance.get_student_outstanding(s.student_id) AS outstanding " +
                "FROM people.students s WHERE s.student_id = ?";
        return jdbc.query(sql, OUTSTANDING_MAPPER, studentId).stream().findFirst();
    }

    /**
     * The headline Project 1 function: outstanding fees for ALL students as a JSON array.
     * Returned as raw JSON text so the controller can pass it straight through.
     */
    public String getAllOutstandingJson() {
        return jdbc.queryForObject("SELECT finance.get_outstanding_fees()::text", String.class);
    }

    /** Gives a freshly-registered student a starter tuition bill so their dashboard is meaningful. */
    public void insertStarterBill(long studentId) {
        jdbc.update(
                "INSERT INTO finance.fee_bills (student_id, academic_year, semester, description, amount_due) " +
                "VALUES (?, '2025/2026', 1, 'Tuition Fee', 9000.00)",
                studentId);
    }
}
