package gh.ug.cpen208.coeapi.repository;

import gh.ug.cpen208.coeapi.dto.CourseDto;
import gh.ug.cpen208.coeapi.dto.EnrollmentDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EnrollmentRepository {

    /** The term students currently register for (trusted constants, safe to inline in SQL). */
    public static final String CURRENT_YEAR = "2025/2026";
    public static final int CURRENT_SEMESTER = 2;

    private final JdbcTemplate jdbc;

    public EnrollmentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<EnrollmentDto> ENROLLMENT_MAPPER = (rs, i) -> new EnrollmentDto(
            rs.getString("code"),
            rs.getString("title"),
            rs.getInt("credit_hours"),
            rs.getString("lecturer"),
            rs.getString("academic_year"),
            rs.getInt("semester"),
            rs.getString("grade")
    );

    private static final RowMapper<CourseDto> COURSE_MAPPER = (rs, i) -> new CourseDto(
            rs.getInt("course_id"),
            rs.getString("code"),
            rs.getString("title"),
            rs.getInt("credit_hours"),
            rs.getString("lecturer"),
            rs.getString("academic_year"),
            rs.getInt("semester")
    );

    // Enrollment rows joined to the lecturer assigned for that same term.
    private static final String ENROLLMENT_SELECT =
            "SELECT c.code, c.title, c.credit_hours, e.academic_year, e.semester, e.grade, " +
            "       TRIM(COALESCE(l.title,'') || ' ' || COALESCE(l.full_name,'')) AS lecturer " +
            "FROM academic.enrollments e " +
            "JOIN academic.courses c ON c.course_id = e.course_id " +
            "LEFT JOIN academic.lecturer_course_assignment lca " +
            "       ON lca.course_id = e.course_id " +
            "      AND lca.academic_year = e.academic_year " +
            "      AND lca.semester = e.semester " +
            "LEFT JOIN people.lecturers l ON l.lecturer_id = lca.lecturer_id ";

    /** All courses the student is enrolled in (both terms), with lecturer. */
    public List<EnrollmentDto> findByStudentId(long studentId) {
        return jdbc.query(ENROLLMENT_SELECT + "WHERE e.student_id = ? ORDER BY e.semester, c.code",
                ENROLLMENT_MAPPER, studentId);
    }

    /** Completed (graded) courses = the student's results. */
    public List<EnrollmentDto> findGrades(long studentId) {
        return jdbc.query(ENROLLMENT_SELECT +
                "WHERE e.student_id = ? AND e.grade IS NOT NULL ORDER BY e.academic_year, c.code",
                ENROLLMENT_MAPPER, studentId);
    }

    // Current-term catalogue with the assigned lecturer; `registered` toggles the EXISTS filter.
    private static String currentCoursesSql(boolean registered) {
        String op = registered ? "EXISTS" : "NOT EXISTS";
        return "SELECT c.course_id, c.code, c.title, c.credit_hours, c.semester, " +
               "       '" + CURRENT_YEAR + "' AS academic_year, " +
               "       TRIM(COALESCE(l.title,'') || ' ' || COALESCE(l.full_name,'')) AS lecturer " +
               "FROM academic.courses c " +
               "LEFT JOIN academic.lecturer_course_assignment lca " +
               "       ON lca.course_id = c.course_id AND lca.semester = c.semester " +
               "      AND lca.academic_year = '" + CURRENT_YEAR + "' " +
               "LEFT JOIN people.lecturers l ON l.lecturer_id = lca.lecturer_id " +
               "WHERE c.semester = " + CURRENT_SEMESTER + " AND " + op + " (" +
               "  SELECT 1 FROM academic.enrollments e " +
               "  WHERE e.student_id = ? AND e.course_id = c.course_id AND e.semester = c.semester) " +
               "ORDER BY c.code";
    }

    /** Current-term courses the student IS registered in (droppable). */
    public List<CourseDto> findCurrentRegistrations(long studentId) {
        return jdbc.query(currentCoursesSql(true), COURSE_MAPPER, studentId);
    }

    /** Current-term courses the student is NOT yet registered in (available to add). */
    public List<CourseDto> findAvailableCourses(long studentId) {
        return jdbc.query(currentCoursesSql(false), COURSE_MAPPER, studentId);
    }

    /** True if the course belongs to the current registerable term. */
    public boolean isCurrentTermCourse(int courseId) {
        Integer n = jdbc.queryForObject(
                "SELECT COUNT(*) FROM academic.courses WHERE course_id = ? AND semester = ?",
                Integer.class, courseId, CURRENT_SEMESTER);
        return n != null && n > 0;
    }

    /** Registers the student for a current-term course. */
    public void enroll(long studentId, int courseId) {
        jdbc.update(
                "INSERT INTO academic.enrollments (student_id, course_id, academic_year, semester) " +
                "VALUES (?, ?, ?, ?)",
                studentId, courseId, CURRENT_YEAR, CURRENT_SEMESTER);
    }

    /** Drops a current-term registration. Returns rows removed. */
    public int drop(long studentId, int courseId) {
        return jdbc.update(
                "DELETE FROM academic.enrollments " +
                "WHERE student_id = ? AND course_id = ? AND academic_year = ? AND semester = ?",
                studentId, courseId, CURRENT_YEAR, CURRENT_SEMESTER);
    }
}
