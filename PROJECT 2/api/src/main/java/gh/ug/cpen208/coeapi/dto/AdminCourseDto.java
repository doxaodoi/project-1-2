package gh.ug.cpen208.coeapi.dto;

/** A course row for the admin catalogue. */
public record AdminCourseDto(
        int courseId,
        String code,
        String title,
        int creditHours,
        int level,
        int semester
) {}
