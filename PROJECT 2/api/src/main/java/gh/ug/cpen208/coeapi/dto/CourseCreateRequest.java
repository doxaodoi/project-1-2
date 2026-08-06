package gh.ug.cpen208.coeapi.dto;

/** Admin request to add a course to the catalogue. */
public record CourseCreateRequest(
        String code,
        String title,
        Integer creditHours,
        Integer level,
        Integer semester
) {}
