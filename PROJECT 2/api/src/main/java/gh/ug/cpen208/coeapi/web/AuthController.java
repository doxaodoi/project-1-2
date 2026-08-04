package gh.ug.cpen208.coeapi.web;

import gh.ug.cpen208.coeapi.dto.AuthResponse;
import gh.ug.cpen208.coeapi.dto.LoginRequest;
import gh.ug.cpen208.coeapi.dto.RegisterRequest;
import gh.ug.cpen208.coeapi.service.AuthService;
import org.springframework.web.bind.annotation.*;

/** Public authentication endpoints. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return auth.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return auth.login(request);
    }

    /** Simple liveness check (public). */
    @GetMapping("/ping")
    public String ping() {
        return "coe-api up";
    }
}
