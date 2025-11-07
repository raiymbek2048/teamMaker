package kg.bishkek.iaau.teammaker.service;


import kg.bishkek.iaau.teammaker.dto.auth.AuthResponse;
import kg.bishkek.iaau.teammaker.dto.auth.LoginRequest;
import kg.bishkek.iaau.teammaker.dto.auth.RegisterRequest;
import kg.bishkek.iaau.teammaker.model.User;

public interface AuthService {
    void register(RegisterRequest req);

    AuthResponse login(LoginRequest loginRequest);

    User getCurrentUser();
}
