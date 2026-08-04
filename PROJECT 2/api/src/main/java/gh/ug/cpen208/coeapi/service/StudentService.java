package gh.ug.cpen208.coeapi.service;

import gh.ug.cpen208.coeapi.dto.EnrollmentDto;
import gh.ug.cpen208.coeapi.dto.OutstandingDto;
import gh.ug.cpen208.coeapi.dto.PaymentDto;
import gh.ug.cpen208.coeapi.dto.StudentDto;
import gh.ug.cpen208.coeapi.error.ApiException;
import gh.ug.cpen208.coeapi.repository.EnrollmentRepository;
import gh.ug.cpen208.coeapi.repository.FeesRepository;
import gh.ug.cpen208.coeapi.repository.StudentRepository;
import org.springframework.stereotype.Service;

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
}
