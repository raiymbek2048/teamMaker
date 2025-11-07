package kg.bishkek.iaau.teammaker.dto.user;

import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class UserListResponse {
    private UUID id;
    private String username;
    private String fullName;
    private Integer age;
    private Set<String> skills;
    private String bio;
    private String location;
}
