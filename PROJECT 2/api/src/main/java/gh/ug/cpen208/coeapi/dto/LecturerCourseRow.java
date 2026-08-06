package gh.ug.cpen208.coeapi.dto;

/** A lecturer→course assignment with its id, so admin can remove it (functionality 4). */
public record LecturerCourseRow(
        int assignmentId,
        String courseCode,
        String courseTitle,
        String lecturer,
        String academicYear,
        int semester
) {}
