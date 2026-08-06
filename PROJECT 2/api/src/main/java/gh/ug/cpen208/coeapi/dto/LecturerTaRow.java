package gh.ug.cpen208.coeapi.dto;

/** A lecturer→TA assignment with its id, so admin can remove it (functionality 5). */
public record LecturerTaRow(
        int assignmentId,
        String lecturer,
        String ta,
        String courseCode,
        String academicYear
) {}
