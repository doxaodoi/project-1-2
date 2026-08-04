package gh.ug.cpen208.coeapi.web;

import gh.ug.cpen208.coeapi.dto.OutstandingDto;
import gh.ug.cpen208.coeapi.dto.StudentDto;
import gh.ug.cpen208.coeapi.security.JwtAuthFilter;
import gh.ug.cpen208.coeapi.service.StudentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Returns the currently-authenticated student (from the JWT) plus their fee summary. */
@RestController
@RequestMapping("/api")
public class MeController {

    private final StudentService students;

    public MeController(StudentService students) {
        this.students = students;
    }

    @GetMapping("/me")
    public Map<String, Object> me(HttpServletRequest request) {
        long id = (Long) request.getAttribute(JwtAuthFilter.ATTR_STUDENT_ID);
        StudentDto student = students.getStudent(id);
        OutstandingDto outstanding = students.getOutstanding(id);
        return Map.of("student", student, "outstanding", outstanding);
    }
}
