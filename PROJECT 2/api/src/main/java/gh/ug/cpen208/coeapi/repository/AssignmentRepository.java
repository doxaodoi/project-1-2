package gh.ug.cpen208.coeapi.repository;

import gh.ug.cpen208.coeapi.dto.LecturerCourseDto;
import gh.ug.cpen208.coeapi.dto.LecturerTaDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Read-only lookups for the lecturer→course and lecturer→TA assignments (functionalities 4 & 5). */
@Repository
public class AssignmentRepository {

    private final JdbcTemplate jdbc;

    public AssignmentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<LecturerCourseDto> LC_MAPPER = (rs, i) -> new LecturerCourseDto(
            rs.getString("code"),
            rs.getString("title"),
            rs.getString("lecturer"),
            rs.getString("academic_year"),
            rs.getInt("semester")
    );

    private static final RowMapper<LecturerTaDto> LT_MAPPER = (rs, i) -> new LecturerTaDto(
            rs.getString("lecturer"),
            rs.getString("ta"),
            rs.getString("code"),
            rs.getString("academic_year")
    );

    /** Which lecturer teaches which course (functionality 4). */
    public List<LecturerCourseDto> lecturerCourse() {
        String sql =
                "SELECT c.code, c.title, lca.academic_year, lca.semester, " +
                "       TRIM(COALESCE(l.title,'') || ' ' || COALESCE(l.full_name,'')) AS lecturer " +
                "FROM academic.lecturer_course_assignment lca " +
                "JOIN academic.courses c   ON c.course_id = lca.course_id " +
                "JOIN people.lecturers l    ON l.lecturer_id = lca.lecturer_id " +
                "ORDER BY lca.semester, c.code";
        return jdbc.query(sql, LC_MAPPER);
    }

    /** Which TA assists which lecturer, for which course (functionality 5). */
    public List<LecturerTaDto> lecturerTa() {
        String sql =
                "SELECT c.code, lta.academic_year, " +
                "       TRIM(COALESCE(l.title,'') || ' ' || COALESCE(l.full_name,'')) AS lecturer, " +
                "       t.full_name AS ta " +
                "FROM academic.lecturer_ta_assignment lta " +
                "JOIN people.lecturers l           ON l.lecturer_id = lta.lecturer_id " +
                "JOIN people.teaching_assistants t ON t.ta_id = lta.ta_id " +
                "JOIN academic.courses c           ON c.course_id = lta.course_id " +
                "ORDER BY lecturer, ta";
        return jdbc.query(sql, LT_MAPPER);
    }
}
