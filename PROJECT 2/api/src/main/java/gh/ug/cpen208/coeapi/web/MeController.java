package gh.ug.cpen208.coeapi.web;

import gh.ug.cpen208.coeapi.dto.CourseDto;
import gh.ug.cpen208.coeapi.dto.EnrollRequest;
import gh.ug.cpen208.coeapi.dto.EnrollmentDto;
import gh.ug.cpen208.coeapi.dto.OutstandingDto;
import gh.ug.cpen208.coeapi.dto.PaymentDto;
import gh.ug.cpen208.coeapi.dto.PaymentRequest;
import gh.ug.cpen208.coeapi.dto.StudentDto;
import gh.ug.cpen208.coeapi.dto.UpdateProfileRequest;
import gh.ug.cpen208.coeapi.error.ApiException;
import gh.ug.cpen208.coeapi.security.JwtAuthFilter;
import gh.ug.cpen208.coeapi.service.StudentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Actions for the currently-authenticated student (id taken from the JWT).
 * Each of the five functionalities is exercised here as a real operation.
 */
@RestController
@RequestMapping("/api/me")
public class MeController {

    private final StudentService students;

    public MeController(StudentService students) {
        this.students = students;
    }

    private static long currentId(HttpServletRequest request) {
        if (!"STUDENT".equals(request.getAttribute(JwtAuthFilter.ATTR_ROLE))) {
            throw ApiException.forbidden("Student access required");
        }
        return (Long) request.getAttribute(JwtAuthFilter.ATTR_STUDENT_ID);
    }

    /** Profile + fee summary for the signed-in student. */
    @GetMapping
    public Map<String, Object> me(HttpServletRequest request) {
        long id = currentId(request);
        return Map.of("student", students.getStudent(id), "outstanding", students.getOutstanding(id));
    }

    // ---- functionality 1: personal information -----------------------
    @PutMapping("/profile")
    public StudentDto updateProfile(@RequestBody UpdateProfileRequest body, HttpServletRequest request) {
        return students.updateProfile(currentId(request), body.email(), body.phone());
    }

    // ---- functionality 2: fees payments ------------------------------
    @PostMapping("/payments")
    public PaymentDto pay(@RequestBody PaymentRequest body, HttpServletRequest request) {
        return students.makePayment(currentId(request), body.amount(), body.method());
    }

    // ---- functionality 3: course registration + grades --------------
    @GetMapping("/grades")
    public List<EnrollmentDto> grades(HttpServletRequest request) {
        return students.getGrades(currentId(request));
    }

    @GetMapping("/registrations")
    public List<CourseDto> registrations(HttpServletRequest request) {
        return students.getCurrentRegistrations(currentId(request));
    }

    @GetMapping("/available-courses")
    public List<CourseDto> available(HttpServletRequest request) {
        return students.getAvailableCourses(currentId(request));
    }

    @PostMapping("/enrollments")
    public Map<String, Object> enroll(@RequestBody EnrollRequest body, HttpServletRequest request) {
        students.enroll(currentId(request), body.courseId());
        return Map.of("status", "registered", "courseId", body.courseId());
    }

    @DeleteMapping("/enrollments/{courseId}")
    public Map<String, Object> drop(@PathVariable int courseId, HttpServletRequest request) {
        students.drop(currentId(request), courseId);
        return Map.of("status", "dropped", "courseId", courseId);
    }
}
