package kg.bishkek.iaau.teammaker.dto.project;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class ProjectListResponse {
    private UUID id;
    private String name;
    private String type;
    private String sphere;
    private String description;
    private Set<String> requiredSkills;
    private String location;
    private String ownerUsername;
    private Instant createdAt;
}
