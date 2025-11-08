package kg.bishkek.iaau.teammaker.controller;

import kg.bishkek.iaau.teammaker.dto.auth.AuthResponse;
import kg.bishkek.iaau.teammaker.dto.auth.LoginRequest;
import kg.bishkek.iaau.teammaker.dto.auth.RegisterRequest;
import kg.bishkek.iaau.teammaker.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
    }
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest registerRequest) {
        return authService.login(registerRequest);
    }

}
