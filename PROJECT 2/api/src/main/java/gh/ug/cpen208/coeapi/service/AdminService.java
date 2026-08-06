package gh.ug.cpen208.coeapi.service;

import gh.ug.cpen208.coeapi.dto.*;
import gh.ug.cpen208.coeapi.error.ApiException;
import gh.ug.cpen208.coeapi.repository.AdminRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/** Admin-only operations: class data plus management of courses and assignments (functionalities 4 & 5). */
@Service
public class AdminService {

    private static final String DEFAULT_YEAR = "2025/2026";

    private final AdminRepository repo;

    public AdminService(AdminRepository repo) {
        this.repo = repo;
    }

    public List<AdminStudentDto> roster() { return repo.roster(); }
    public List<OptionDto> lecturerOptions() { return repo.lecturerOptions(); }
    public List<OptionDto> courseOptions() { return repo.courseOptions(); }
    public List<OptionDto> taOptions() { return repo.taOptions(); }
    public List<AdminCourseDto> courses() { return repo.courses(); }
    public List<LecturerCourseRow> lecturerCourseAssignments() { return repo.lecturerCourseAssignments(); }
    public List<LecturerTaRow> lecturerTaAssignments() { return repo.lecturerTaAssignments(); }

    // ---- functionality 4: lecturer -> course --------------------------
    public LecturerCourseRow assignLecturerCourse(LecturerCourseRequest req) {
        require(req != null && req.lecturerId() != null && req.courseId() != null, "lecturerId and courseId are required");
        String year = blankToDefault(req.academicYear());
        int sem = req.semester() == null ? 2 : req.semester();
        try {
            int id = repo.addLecturerCourse(req.lecturerId(), req.courseId(), year, sem);
            return repo.lecturerCourseAssignments().stream()
                    .filter(r -> r.assignmentId() == id).findFirst().orElseThrow();
        } catch (DuplicateKeyException e) {
            throw ApiException.conflict("That lecturer is already assigned to this course for the term");
        } catch (DataIntegrityViolationException e) {
            throw ApiException.badRequest("Unknown lecturer or course");
        }
    }

    public void removeLecturerCourse(int assignmentId) {
        if (repo.removeLecturerCourse(assignmentId) == 0) throw ApiException.notFound("Assignment not found");
    }

    // ---- functionality 5: lecturer -> TA ------------------------------
    public LecturerTaRow assignLecturerTa(LecturerTaRequest req) {
        require(req != null && req.lecturerId() != null && req.taId() != null && req.courseId() != null,
                "lecturerId, taId and courseId are required");
        String year = blankToDefault(req.academicYear());
        try {
            int id = repo.addLecturerTa(req.lecturerId(), req.taId(), req.courseId(), year);
            return repo.lecturerTaAssignments().stream()
                    .filter(r -> r.assignmentId() == id).findFirst().orElseThrow();
        } catch (DuplicateKeyException e) {
            throw ApiException.conflict("That TA is already assigned to this lecturer for the course");
        } catch (DataIntegrityViolationException e) {
            throw ApiException.badRequest("Unknown lecturer, TA or course");
        }
    }

    public void removeLecturerTa(int assignmentId) {
        if (repo.removeLecturerTa(assignmentId) == 0) throw ApiException.notFound("Assignment not found");
    }

    // ---- manage courses ----------------------------------------------
    public Map<String, Object> addCourse(CourseCreateRequest req) {
        require(req != null && req.code() != null && !req.code().isBlank(), "Course code is required");
        require(req.title() != null && !req.title().isBlank(), "Course title is required");
        int credits = req.creditHours() == null ? 3 : req.creditHours();
        int level = req.level() == null ? 200 : req.level();
        int sem = req.semester() == null ? 2 : req.semester();
        require(sem == 1 || sem == 2, "Semester must be 1 or 2");
        try {
            int id = repo.addCourse(req.code().trim().toUpperCase(), req.title().trim(), credits, level, sem);
            return Map.of("courseId", id, "code", req.code().trim().toUpperCase());
        } catch (DuplicateKeyException e) {
            throw ApiException.conflict("A course with that code already exists");
        }
    }

    private static void require(boolean condition, String message) {
        if (!condition) throw ApiException.badRequest(message);
    }

    private static String blankToDefault(String year) {
        return (year == null || year.isBlank()) ? DEFAULT_YEAR : year.trim();
    }
}
