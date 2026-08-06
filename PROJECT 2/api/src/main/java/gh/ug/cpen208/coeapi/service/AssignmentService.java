package gh.ug.cpen208.coeapi.service;

import gh.ug.cpen208.coeapi.dto.LecturerCourseDto;
import gh.ug.cpen208.coeapi.dto.LecturerTaDto;
import gh.ug.cpen208.coeapi.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/** Read-only views of the lecturer→course and lecturer→TA assignments (functionalities 4 & 5). */
@Service
public class AssignmentService {

    private final AssignmentRepository assignments;

    public AssignmentService(AssignmentRepository assignments) {
        this.assignments = assignments;
    }

    public List<LecturerCourseDto> lecturerCourse() {
        return assignments.lecturerCourse();
    }

    public List<LecturerTaDto> lecturerTa() {
        return assignments.lecturerTa();
    }
}
