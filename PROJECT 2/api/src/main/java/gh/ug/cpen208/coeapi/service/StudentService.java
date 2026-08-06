package gh.ug.cpen208.coeapi.service;

import gh.ug.cpen208.coeapi.dto.CourseDto;
import gh.ug.cpen208.coeapi.dto.EnrollmentDto;
import gh.ug.cpen208.coeapi.dto.OutstandingDto;
import gh.ug.cpen208.coeapi.dto.PaymentDto;
import gh.ug.cpen208.coeapi.dto.StudentDto;
import gh.ug.cpen208.coeapi.error.ApiException;
import gh.ug.cpen208.coeapi.repository.EnrollmentRepository;
import gh.ug.cpen208.coeapi.repository.FeesRepository;
import gh.ug.cpen208.coeapi.repository.StudentRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StudentService {

    private final StudentRepository students;
    private final EnrollmentRepository enrollments;
    private final FeesRepository fees;

    public StudentService(StudentRepository students, EnrollmentRepository enrollments, FeesRepository fees) {
        this.students = students;
        this.enrollments = enrollments;
        this.fees = fees;
    }

    public StudentDto getStudent(long studentId) {
        return students.findById(studentId)
                .orElseThrow(() -> ApiException.notFound("Student " + studentId + " not found"));
    }

    public List<EnrollmentDto> getEnrollments(long studentId) {
        return enrollments.findByStudentId(studentId);
    }

    public List<PaymentDto> getPayments(long studentId) {
        return fees.findPayments(studentId);
    }

    public OutstandingDto getOutstanding(long studentId) {
        return fees.getOutstanding(studentId)
                .orElseThrow(() -> ApiException.notFound("Student " + studentId + " not found"));
    }

    // ---- functionality 1: edit personal/contact information ----------
    public StudentDto updateProfile(long studentId, String email, String phone) {
        if (email == null || email.isBlank()) {
            throw ApiException.badRequest("Email is required");
        }
        try {
            students.updateContact(studentId, email.trim(), phone == null ? null : phone.trim());
        } catch (DuplicateKeyException e) {
            throw ApiException.conflict("That email is already in use");
        }
        return getStudent(studentId);
    }

    // ---- functionality 2: make a fee payment -------------------------
    public PaymentDto makePayment(long studentId, BigDecimal amount, String method) {
        if (amount == null || amount.signum() <= 0) {
            throw ApiException.badRequest("Payment amount must be greater than zero");
        }
        OutstandingDto current = getOutstanding(studentId);
        if (amount.compareTo(current.outstanding()) > 0) {
            throw ApiException.badRequest("Payment exceeds the outstanding balance of " + current.outstanding());
        }
        String m = (method == null || method.isBlank()) ? "BANK" : method.trim().toUpperCase();
        return fees.insertPayment(studentId, amount, m);
    }

    // ---- functionality 3: course registration ------------------------
    public List<EnrollmentDto> getGrades(long studentId) {
        return enrollments.findGrades(studentId);
    }

    public List<CourseDto> getCurrentRegistrations(long studentId) {
        return enrollments.findCurrentRegistrations(studentId);
    }

    public List<CourseDto> getAvailableCourses(long studentId) {
        return enrollments.findAvailableCourses(studentId);
    }

    public void enroll(long studentId, int courseId) {
        if (!enrollments.isCurrentTermCourse(courseId)) {
            throw ApiException.badRequest("Course is not open for registration this semester");
        }
        try {
            enrollments.enroll(studentId, courseId);
        } catch (DuplicateKeyException e) {
            throw ApiException.conflict("You are already registered for this course");
        }
    }

    public void drop(long studentId, int courseId) {
        if (enrollments.drop(studentId, courseId) == 0) {
            throw ApiException.badRequest("You are not registered for this course");
        }
    }
}
