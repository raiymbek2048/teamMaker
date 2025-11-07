package kg.bishkek.iaau.teammaker.dto.user;

import lombok.Data;

import java.util.Set;

@Data
public class UserProfileRequest {
    private String fullName;
    private Integer age;
    private Set<String> skills;
    private String bio;
    private String location;
    private String phone;
    private String telegram;
    private String instagram;
}
