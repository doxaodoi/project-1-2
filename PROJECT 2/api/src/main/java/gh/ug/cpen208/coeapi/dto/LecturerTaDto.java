package gh.ug.cpen208.coeapi.dto;

/** A lecturer-to-TA assignment, read-only display (functionality 5). */
public record LecturerTaDto(
        String lecturer,
        String ta,
        String courseCode,
        String academicYear
) {}
