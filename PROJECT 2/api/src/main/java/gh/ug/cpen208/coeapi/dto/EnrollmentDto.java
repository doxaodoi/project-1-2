package gh.ug.cpen208.coeapi.dto;

/** A course a student is enrolled in, plus the assigned lecturer (functionalities 3 & 4). */
public record EnrollmentDto(
        String courseCode,
        String courseTitle,
        int creditHours,
        String lecturer,
        String academicYear,
        int semester,
        String grade
) {}
