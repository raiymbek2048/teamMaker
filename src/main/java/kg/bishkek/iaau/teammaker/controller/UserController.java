package kg.bishkek.iaau.teammaker.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.bishkek.iaau.teammaker.dto.user.UserListResponse;
import kg.bishkek.iaau.teammaker.dto.user.UserProfileRequest;
import kg.bishkek.iaau.teammaker.dto.user.UserProfileResponse;
import kg.bishkek.iaau.teammaker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "User management APIs")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(Authentication authentication) {
        String username = authentication.getName();
        UserProfileResponse profile = userService.getCurrentUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserProfileResponse> updateCurrentUserProfile(
            @RequestBody UserProfileRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        UserProfileResponse updatedProfile = userService.getCurrentUserProfile(username);
        UserProfileResponse response = userService.updateUserProfile(updatedProfile.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user profile by ID")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable UUID userId) {
        UserProfileResponse profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserListResponse>> getAllUsers(
            @RequestParam(required = false) String search) {
        List<UserListResponse> users;
        if (search != null && !search.trim().isEmpty()) {
            users = userService.searchUsers(search);
        } else {
            users = userService.getAllUsers();
        }
        return ResponseEntity.ok(users);
    }
}
