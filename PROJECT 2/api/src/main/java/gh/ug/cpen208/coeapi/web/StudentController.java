package gh.ug.cpen208.coeapi.web;

import gh.ug.cpen208.coeapi.dto.EnrollmentDto;
import gh.ug.cpen208.coeapi.dto.OutstandingDto;
import gh.ug.cpen208.coeapi.dto.PaymentDto;
import gh.ug.cpen208.coeapi.dto.StudentDto;
import gh.ug.cpen208.coeapi.error.ApiException;
import gh.ug.cpen208.coeapi.security.JwtAuthFilter;
import gh.ug.cpen208.coeapi.service.StudentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Protected per-student endpoints. A student may only read their own record. */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService students;

    public StudentController(StudentService students) {
        this.students = students;
    }

    @GetMapping("/{id}")
    public StudentDto getStudent(@PathVariable long id, HttpServletRequest request) {
        requireSelf(id, request);
        return students.getStudent(id);
    }

    @GetMapping("/{id}/enrollments")
    public List<EnrollmentDto> getEnrollments(@PathVariable long id, HttpServletRequest request) {
        requireSelf(id, request);
        return students.getEnrollments(id);
    }

    @GetMapping("/{id}/payments")
    public List<PaymentDto> getPayments(@PathVariable long id, HttpServletRequest request) {
        requireSelf(id, request);
        return students.getPayments(id);
    }

    @GetMapping("/{id}/outstanding")
    public OutstandingDto getOutstanding(@PathVariable long id, HttpServletRequest request) {
        requireSelf(id, request);
        return students.getOutstanding(id);
    }

    /** Ensures the JWT's subject matches the requested student id. */
    private void requireSelf(long id, HttpServletRequest request) {
        Object authId = request.getAttribute(JwtAuthFilter.ATTR_STUDENT_ID);
        if (authId == null || ((Long) authId) != id) {
            throw ApiException.forbidden("You can only access your own records");
        }
    }
}
