package gh.ug.cpen208.coeapi.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /** A login account row. studentId is null for admin accounts. */
    public record UserRow(long userId, Long studentId, String fullName,
                          String email, String passwordHash, String role) {}

    private static final RowMapper<UserRow> MAPPER = (rs, i) -> new UserRow(
            rs.getLong("user_id"),
            rs.getObject("student_id", Long.class),
            rs.getString("full_name"),
            rs.getString("email"),
            rs.getString("password_hash"),
            rs.getString("role")
    );

    public Optional<UserRow> findByEmail(String email) {
        List<UserRow> rows = jdbc.query(
                "SELECT user_id, student_id, full_name, email, password_hash, role " +
                "FROM auth.users WHERE email = ?",
                MAPPER, email);
        return rows.stream().findFirst();
    }

    public boolean existsByEmail(String email) {
        Integer n = jdbc.queryForObject(
                "SELECT COUNT(*) FROM auth.users WHERE email = ?", Integer.class, email);
        return n != null && n > 0;
    }

    public boolean existsByStudentId(long studentId) {
        Integer n = jdbc.queryForObject(
                "SELECT COUNT(*) FROM auth.users WHERE student_id = ?", Integer.class, studentId);
        return n != null && n > 0;
    }

    public void insert(long studentId, String email, String passwordHash, String role) {
        jdbc.update(
                "INSERT INTO auth.users (student_id, email, password_hash, role) VALUES (?, ?, ?, ?)",
                studentId, email, passwordHash, role);
    }
}
