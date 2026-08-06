package gh.ug.cpen208.coeapi.dto;

/** A lecturer-to-course assignment, read-only display (functionality 4). */
public record LecturerCourseDto(
        String courseCode,
        String courseTitle,
        String lecturer,
        String academicYear,
        int semester
) {}
