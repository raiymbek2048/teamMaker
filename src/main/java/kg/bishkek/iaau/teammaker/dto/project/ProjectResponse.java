package kg.bishkek.iaau.teammaker.dto.project;

import kg.bishkek.iaau.teammaker.dto.user.UserListResponse;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class ProjectResponse {
    private UUID id;
    private String name;
    private String type;
    private String sphere;
    private String description;
    private Set<String> requiredSkills;
    private String location;
    private Set<String> team;
    private UserListResponse owner;
    private Set<UserListResponse> members;
    private Instant createdAt;
}
