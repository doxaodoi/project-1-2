package gh.ug.cpen208.coeapi.web;

import gh.ug.cpen208.coeapi.dto.LecturerCourseDto;
import gh.ug.cpen208.coeapi.dto.LecturerTaDto;
import gh.ug.cpen208.coeapi.service.AssignmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Read-only assignment listings (functionalities 4 & 5). Any authenticated user may view. */
@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignments;

    public AssignmentController(AssignmentService assignments) {
        this.assignments = assignments;
    }

    @GetMapping("/lecturer-course")
    public List<LecturerCourseDto> lecturerCourse() {
        return assignments.lecturerCourse();
    }

    @GetMapping("/lecturer-ta")
    public List<LecturerTaDto> lecturerTa() {
        return assignments.lecturerTa();
    }
}
