package gh.ug.cpen208.coeapi.repository;

import gh.ug.cpen208.coeapi.dto.StudentDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class StudentRepository {

    private final JdbcTemplate jdbc;

    public StudentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<StudentDto> MAPPER = (rs, i) -> new StudentDto(
            rs.getLong("student_id"),
            rs.getString("full_name"),
            rs.getString("email"),
            rs.getString("phone"),
            rs.getObject("date_of_birth", LocalDate.class),
            rs.getInt("level"),
            rs.getString("program")
    );

    private static final String SELECT =
            "SELECT s.student_id, s.full_name, s.email, s.phone, s.date_of_birth, " +
            "       s.level, p.name AS program " +
            "FROM people.students s " +
            "JOIN people.programs p ON p.program_id = s.program_id ";

    public Optional<StudentDto> findById(long studentId) {
        List<StudentDto> rows = jdbc.query(SELECT + "WHERE s.student_id = ?", MAPPER, studentId);
        return rows.stream().findFirst();
    }

    public boolean existsById(long studentId) {
        Integer n = jdbc.queryForObject(
                "SELECT COUNT(*) FROM people.students WHERE student_id = ?", Integer.class, studentId);
        return n != null && n > 0;
    }

    /** Inserts a self-registered student. Defaults to program 1, level 200. */
    public void insert(long studentId, String fullName, String email) {
        jdbc.update(
                "INSERT INTO people.students (student_id, full_name, email, level, program_id, enrolled_on) " +
                "VALUES (?, ?, ?, 200, 1, CURRENT_DATE)",
                studentId, fullName, email);
    }

    /** Updates a student's editable contact details (functionality 1). */
    public void updateContact(long studentId, String email, String phone) {
        jdbc.update(
                "UPDATE people.students SET email = ?, phone = ? WHERE student_id = ?",
                email, phone, studentId);
    }
}
