package gh.ug.cpen208.coeapi.service;

import gh.ug.cpen208.coeapi.dto.*;
import gh.ug.cpen208.coeapi.error.ApiException;
import gh.ug.cpen208.coeapi.repository.FeesRepository;
import gh.ug.cpen208.coeapi.repository.StudentRepository;
import gh.ug.cpen208.coeapi.repository.UserRepository;
import gh.ug.cpen208.coeapi.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final StudentRepository students;
    private final FeesRepository fees;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthService(UserRepository users, StudentRepository students, FeesRepository fees,
                       PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users;
        this.students = students;
        this.fees = fees;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (req == null || req.studentId() == null) {
            throw ApiException.badRequest("studentId is required");
        }
        String fullName = req.fullName() == null ? "" : req.fullName().trim();
        String email = req.email() == null ? "" : req.email().trim().toLowerCase();
        String password = req.password() == null ? "" : req.password();

        if (fullName.isEmpty()) throw ApiException.badRequest("fullName is required");
        if (!email.contains("@")) throw ApiException.badRequest("A valid email is required");
        if (password.length() < 6) throw ApiException.badRequest("Password must be at least 6 characters");

        if (users.existsByEmail(email)) throw ApiException.conflict("Email already registered");
        if (users.existsByStudentId(req.studentId())) {
            throw ApiException.conflict("This student already has an account");
        }

        long studentId = req.studentId();
        if (!students.existsById(studentId)) {
            students.insert(studentId, fullName, email);
            fees.insertStarterBill(studentId); // so a new student's dashboard isn't empty
        }
        users.insert(studentId, email, encoder.encode(password), "STUDENT");

        StudentDto dto = students.findById(studentId)
                .orElseThrow(() -> ApiException.badRequest("Could not create student"));
        return new AuthResponse(jwt.generateToken(studentId, email, "STUDENT"), "STUDENT", dto.fullName(), dto);
    }

    public AuthResponse login(LoginRequest req) {
        String email = req == null || req.email() == null ? "" : req.email().trim().toLowerCase();
        String password = req == null || req.password() == null ? "" : req.password();

        var user = users.findByEmail(email)
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));
        if (!encoder.matches(password, user.passwordHash())) {
            throw ApiException.unauthorized("Invalid email or password");
        }

        // Admin accounts have no student profile; the token's subject is 0.
        if ("ADMIN".equals(user.role())) {
            String name = user.fullName() == null ? "Administrator" : user.fullName();
            return new AuthResponse(jwt.generateToken(0L, user.email(), "ADMIN"), "ADMIN", name, null);
        }

        StudentDto dto = students.findById(user.studentId())
                .orElseThrow(() -> ApiException.notFound("Student profile not found"));
        return new AuthResponse(jwt.generateToken(user.studentId(), user.email(), "STUDENT"),
                "STUDENT", dto.fullName(), dto);
    }
}
