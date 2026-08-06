package gh.ug.cpen208.coeapi.web;

import gh.ug.cpen208.coeapi.dto.*;
import gh.ug.cpen208.coeapi.error.ApiException;
import gh.ug.cpen208.coeapi.security.JwtAuthFilter;
import gh.ug.cpen208.coeapi.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Department-admin console API. Every endpoint requires an ADMIN token. */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService admin;

    public AdminController(AdminService admin) {
        this.admin = admin;
    }

    /** Rejects any caller whose JWT role is not ADMIN. */
    private static void requireAdmin(HttpServletRequest request) {
        if (!"ADMIN".equals(request.getAttribute(JwtAuthFilter.ATTR_ROLE))) {
            throw ApiException.forbidden("Administrator access required");
        }
    }

    // ---- class data + option lists -----------------------------------
    @GetMapping("/students")
    public List<AdminStudentDto> students(HttpServletRequest r) { requireAdmin(r); return admin.roster(); }

    @GetMapping("/lecturers")
    public List<OptionDto> lecturers(HttpServletRequest r) { requireAdmin(r); return admin.lecturerOptions(); }

    @GetMapping("/course-options")
    public List<OptionDto> courseOptions(HttpServletRequest r) { requireAdmin(r); return admin.courseOptions(); }

    @GetMapping("/tas")
    public List<OptionDto> tas(HttpServletRequest r) { requireAdmin(r); return admin.taOptions(); }

    @GetMapping("/courses")
    public List<AdminCourseDto> courses(HttpServletRequest r) { requireAdmin(r); return admin.courses(); }

    // ---- functionality 4: lecturer -> course -------------------------
    @GetMapping("/lecturer-course")
    public List<LecturerCourseRow> lecturerCourse(HttpServletRequest r) { requireAdmin(r); return admin.lecturerCourseAssignments(); }

    @PostMapping("/lecturer-course")
    public LecturerCourseRow addLecturerCourse(@RequestBody LecturerCourseRequest body, HttpServletRequest r) {
        requireAdmin(r);
        return admin.assignLecturerCourse(body);
    }

    @DeleteMapping("/lecturer-course/{assignmentId}")
    public Map<String, Object> removeLecturerCourse(@PathVariable int assignmentId, HttpServletRequest r) {
        requireAdmin(r);
        admin.removeLecturerCourse(assignmentId);
        return Map.of("status", "removed", "assignmentId", assignmentId);
    }

    // ---- functionality 5: lecturer -> TA -----------------------------
    @GetMapping("/lecturer-ta")
    public List<LecturerTaRow> lecturerTa(HttpServletRequest r) { requireAdmin(r); return admin.lecturerTaAssignments(); }

    @PostMapping("/lecturer-ta")
    public LecturerTaRow addLecturerTa(@RequestBody LecturerTaRequest body, HttpServletRequest r) {
        requireAdmin(r);
        return admin.assignLecturerTa(body);
    }

    @DeleteMapping("/lecturer-ta/{assignmentId}")
    public Map<String, Object> removeLecturerTa(@PathVariable int assignmentId, HttpServletRequest r) {
        requireAdmin(r);
        admin.removeLecturerTa(assignmentId);
        return Map.of("status", "removed", "assignmentId", assignmentId);
    }

    // ---- manage courses ----------------------------------------------
    @PostMapping("/courses")
    public Map<String, Object> addCourse(@RequestBody CourseCreateRequest body, HttpServletRequest r) {
        requireAdmin(r);
        return admin.addCourse(body);
    }
}
