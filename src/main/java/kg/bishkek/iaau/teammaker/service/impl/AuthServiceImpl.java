package kg.bishkek.iaau.teammaker.service.impl;

import kg.bishkek.iaau.teammaker.dto.auth.AuthResponse;
import kg.bishkek.iaau.teammaker.dto.auth.LoginRequest;
import kg.bishkek.iaau.teammaker.dto.auth.RegisterRequest;
import kg.bishkek.iaau.teammaker.config.JwtService;
import kg.bishkek.iaau.teammaker.exception.BadRequestException;
import kg.bishkek.iaau.teammaker.model.User;
import kg.bishkek.iaau.teammaker.model.enums.Role;
import kg.bishkek.iaau.teammaker.repository.UserRepository;
import kg.bishkek.iaau.teammaker.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public void register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Имя пользователя уже занято");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email уже зарегистрирован");
        }
        if (userRepository.existsByPhoneNumber(req.getPhoneNumber())) {
            throw new IllegalArgumentException("Номер телефона уже зарегистрирован");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        Optional<User> user = userRepository.findByUsernameOrEmailOrPhoneNumber(loginRequest.getLogin(), loginRequest.getLogin(), loginRequest.getLogin());
        String token;
        if (user.isEmpty())
            throw new BadRequestException("User with this login (username/email/phone number) does not exist");
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getPassword()));
            token = jwtService.generateToken(user.get());
        } catch (Exception e) {
            throw new BadRequestException("Invalid email or password");
        }

        return new AuthResponse(token, user.get().getRole().name());
    }


    @Override
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String username = userDetails.getUsername();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

    }


}
