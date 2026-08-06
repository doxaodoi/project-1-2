package gh.ug.cpen208.coeapi.dto;

/** Admin request to assign a lecturer to a course (functionality 4). */
public record LecturerCourseRequest(
        Integer lecturerId,
        Integer courseId,
        String academicYear,
        Integer semester
) {}
