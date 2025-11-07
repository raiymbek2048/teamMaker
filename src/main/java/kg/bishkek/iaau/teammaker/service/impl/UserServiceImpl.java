package kg.bishkek.iaau.teammaker.service.impl;

import kg.bishkek.iaau.teammaker.dto.user.UserListResponse;
import kg.bishkek.iaau.teammaker.dto.user.UserProfileRequest;
import kg.bishkek.iaau.teammaker.dto.user.UserProfileResponse;
import kg.bishkek.iaau.teammaker.exception.NotFoundException;
import kg.bishkek.iaau.teammaker.model.User;
import kg.bishkek.iaau.teammaker.repository.UserRepository;
import kg.bishkek.iaau.teammaker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(UUID userId) {
        User user = userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return mapToProfileResponse(user);
    }

    @Override
    public UserProfileResponse updateUserProfile(UUID userId, UserProfileRequest request) {
        User user = userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.setFullName(request.getFullName());
        user.setAge(request.getAge());
        user.setSkills(request.getSkills());
        user.setBio(request.getBio());
        user.setLocation(request.getLocation());
        user.setPhone(request.getPhone());
        user.setTelegram(request.getTelegram());
        user.setInstagram(request.getInstagram());

        User savedUser = userRepository.save(user);
        return mapToProfileResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserListResponse> getAllUsers() {
        return userRepository.findByActiveTrue().stream()
                .map(this::mapToListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserListResponse> searchUsers(String search) {
        if (search == null || search.trim().isEmpty()) {
            return getAllUsers();
        }
        return userRepository.searchUsers(search).stream()
                .map(this::mapToListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return mapToProfileResponse(user);
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .age(user.getAge())
                .skills(user.getSkills())
                .bio(user.getBio())
                .location(user.getLocation())
                .phone(user.getPhone())
                .telegram(user.getTelegram())
                .instagram(user.getInstagram())
                .build();
    }

    private UserListResponse mapToListResponse(User user) {
        return UserListResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .age(user.getAge())
                .skills(user.getSkills())
                .bio(user.getBio())
                .location(user.getLocation())
                .build();
    }
}
