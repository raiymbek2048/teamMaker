package kg.bishkek.iaau.teammaker.service;

import kg.bishkek.iaau.teammaker.dto.user.UserListResponse;
import kg.bishkek.iaau.teammaker.dto.user.UserProfileRequest;
import kg.bishkek.iaau.teammaker.dto.user.UserProfileResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {

    UserProfileResponse getUserProfile(UUID userId);

    UserProfileResponse updateUserProfile(UUID userId, UserProfileRequest request);

    List<UserListResponse> getAllUsers();

    List<UserListResponse> searchUsers(String search);

    UserProfileResponse getCurrentUserProfile(String username);
}
