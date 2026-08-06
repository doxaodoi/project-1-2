package gh.ug.cpen208.coeapi.dto;

/** A current-term course a student can register for or is registered in (functionality 3). */
public record CourseDto(
        int courseId,
        String courseCode,
        String courseTitle,
        int creditHours,
        String lecturer,
        String academicYear,
        int semester
) {}
