package kg.bishkek.iaau.teammaker.dto.user;

import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class UserProfileResponse {
    private UUID id;
    private String username;
    private String email;
    private String fullName;
    private Integer age;
    private Set<String> skills;
    private String bio;
    private String location;
    private String phone;
    private String telegram;
    private String instagram;
}
