package gh.ug.cpen208.coeapi.dto;

/** Admin request to assign a TA to a lecturer for a course (functionality 5). */
public record LecturerTaRequest(
        Integer lecturerId,
        Integer taId,
        Integer courseId,
        String academicYear
) {}
