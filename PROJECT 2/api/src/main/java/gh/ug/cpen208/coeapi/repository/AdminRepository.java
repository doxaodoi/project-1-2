package gh.ug.cpen208.coeapi.repository;

import gh.ug.cpen208.coeapi.dto.AdminCourseDto;
import gh.ug.cpen208.coeapi.dto.AdminStudentDto;
import gh.ug.cpen208.coeapi.dto.LecturerCourseRow;
import gh.ug.cpen208.coeapi.dto.LecturerTaRow;
import gh.ug.cpen208.coeapi.dto.OptionDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Data access for the admin console: class roster, option lists, and assignment/course management. */
@Repository
public class AdminRepository {

    private final JdbcTemplate jdbc;

    public AdminRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<AdminStudentDto> STUDENT_MAPPER = (rs, i) -> new AdminStudentDto(
            rs.getLong("student_id"), rs.getString("full_name"), rs.getString("email"),
            rs.getString("phone"), rs.getInt("level"),
            rs.getBigDecimal("total_billed"), rs.getBigDecimal("total_paid"), rs.getBigDecimal("outstanding"));

    private static final RowMapper<OptionDto> OPTION_MAPPER =
            (rs, i) -> new OptionDto(rs.getInt("id"), rs.getString("label"));

    private static final RowMapper<AdminCourseDto> COURSE_MAPPER = (rs, i) -> new AdminCourseDto(
            rs.getInt("course_id"), rs.getString("code"), rs.getString("title"),
            rs.getInt("credit_hours"), rs.getInt("level"), rs.getInt("semester"));

    private static final RowMapper<LecturerCourseRow> LC_MAPPER = (rs, i) -> new LecturerCourseRow(
            rs.getInt("assignment_id"), rs.getString("code"), rs.getString("title"),
            rs.getString("lecturer"), rs.getString("academic_year"), rs.getInt("semester"));

    private static final RowMapper<LecturerTaRow> LT_MAPPER = (rs, i) -> new LecturerTaRow(
            rs.getInt("assignment_id"), rs.getString("lecturer"), rs.getString("ta"),
            rs.getString("code"), rs.getString("academic_year"));

    /** Class roster with each student's billed / paid / outstanding position. */
    public List<AdminStudentDto> roster() {
        String sql =
                "SELECT s.student_id, s.full_name, s.email, s.phone, s.level, " +
                "  COALESCE((SELECT SUM(amount_due) FROM finance.fee_bills WHERE student_id=s.student_id),0) AS total_billed, " +
                "  COALESCE((SELECT SUM(amount)     FROM finance.payments  WHERE student_id=s.student_id),0) AS total_paid, " +
                "  finance.get_student_outstanding(s.student_id) AS outstanding " +
                "FROM people.students s ORDER BY s.full_name";
        return jdbc.query(sql, STUDENT_MAPPER);
    }

    public List<OptionDto> lecturerOptions() {
        return jdbc.query(
                "SELECT lecturer_id AS id, TRIM(COALESCE(title,'') || ' ' || full_name) AS label " +
                "FROM people.lecturers ORDER BY full_name", OPTION_MAPPER);
    }

    public List<OptionDto> courseOptions() {
        return jdbc.query(
                "SELECT course_id AS id, code || ' - ' || title AS label " +
                "FROM academic.courses ORDER BY code", OPTION_MAPPER);
    }

    public List<OptionDto> taOptions() {
        return jdbc.query(
                "SELECT ta_id AS id, full_name AS label FROM people.teaching_assistants ORDER BY full_name",
                OPTION_MAPPER);
    }

    public List<AdminCourseDto> courses() {
        return jdbc.query(
                "SELECT course_id, code, title, credit_hours, level, semester " +
                "FROM academic.courses ORDER BY semester, code", COURSE_MAPPER);
    }

    public List<LecturerCourseRow> lecturerCourseAssignments() {
        return jdbc.query(
                "SELECT lca.assignment_id, c.code, c.title, lca.academic_year, lca.semester, " +
                "       TRIM(COALESCE(l.title,'') || ' ' || l.full_name) AS lecturer " +
                "FROM academic.lecturer_course_assignment lca " +
                "JOIN academic.courses c ON c.course_id = lca.course_id " +
                "JOIN people.lecturers l ON l.lecturer_id = lca.lecturer_id " +
                "ORDER BY lca.semester, c.code", LC_MAPPER);
    }

    public List<LecturerTaRow> lecturerTaAssignments() {
        return jdbc.query(
                "SELECT lta.assignment_id, c.code, lta.academic_year, " +
                "       TRIM(COALESCE(l.title,'') || ' ' || l.full_name) AS lecturer, t.full_name AS ta " +
                "FROM academic.lecturer_ta_assignment lta " +
                "JOIN people.lecturers l ON l.lecturer_id = lta.lecturer_id " +
                "JOIN people.teaching_assistants t ON t.ta_id = lta.ta_id " +
                "JOIN academic.courses c ON c.course_id = lta.course_id " +
                "ORDER BY lecturer, ta", LT_MAPPER);
    }

    public int addLecturerCourse(int lecturerId, int courseId, String academicYear, int semester) {
        return jdbc.queryForObject(
                "INSERT INTO academic.lecturer_course_assignment (lecturer_id, course_id, academic_year, semester) " +
                "VALUES (?, ?, ?, ?) RETURNING assignment_id",
                Integer.class, lecturerId, courseId, academicYear, semester);
    }

    public int removeLecturerCourse(int assignmentId) {
        return jdbc.update("DELETE FROM academic.lecturer_course_assignment WHERE assignment_id = ?", assignmentId);
    }

    public int addLecturerTa(int lecturerId, int taId, int courseId, String academicYear) {
        return jdbc.queryForObject(
                "INSERT INTO academic.lecturer_ta_assignment (lecturer_id, ta_id, course_id, academic_year) " +
                "VALUES (?, ?, ?, ?) RETURNING assignment_id",
                Integer.class, lecturerId, taId, courseId, academicYear);
    }

    public int removeLecturerTa(int assignmentId) {
        return jdbc.update("DELETE FROM academic.lecturer_ta_assignment WHERE assignment_id = ?", assignmentId);
    }

    public int addCourse(String code, String title, int creditHours, int level, int semester) {
        return jdbc.queryForObject(
                "INSERT INTO academic.courses (code, title, credit_hours, level, semester) " +
                "VALUES (?, ?, ?, ?, ?) RETURNING course_id",
                Integer.class, code, title, creditHours, level, semester);
    }
}
