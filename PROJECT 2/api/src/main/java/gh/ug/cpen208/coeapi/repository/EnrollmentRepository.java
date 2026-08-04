package gh.ug.cpen208.coeapi.repository;

import gh.ug.cpen208.coeapi.dto.EnrollmentDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EnrollmentRepository {

    private final JdbcTemplate jdbc;

    public EnrollmentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<EnrollmentDto> MAPPER = (rs, i) -> new EnrollmentDto(
            rs.getString("code"),
            rs.getString("title"),
            rs.getInt("credit_hours"),
            rs.getString("lecturer"),
            rs.getString("academic_year"),
            rs.getInt("semester"),
            rs.getString("grade")
    );

    /** Courses the student is enrolled in, joined to the assigned lecturer. */
    public List<EnrollmentDto> findByStudentId(long studentId) {
        String sql =
                "SELECT c.code, c.title, c.credit_hours, e.academic_year, e.semester, e.grade, " +
                "       TRIM(COALESCE(l.title,'') || ' ' || COALESCE(l.full_name,'')) AS lecturer " +
                "FROM academic.enrollments e " +
                "JOIN academic.courses c ON c.course_id = e.course_id " +
                "LEFT JOIN academic.lecturer_course_assignment lca " +
                "       ON lca.course_id = e.course_id " +
                "      AND lca.academic_year = e.academic_year " +
                "      AND lca.semester = e.semester " +
                "LEFT JOIN people.lecturers l ON l.lecturer_id = lca.lecturer_id " +
                "WHERE e.student_id = ? " +
                "ORDER BY c.code";
        return jdbc.query(sql, MAPPER, studentId);
    }
}
