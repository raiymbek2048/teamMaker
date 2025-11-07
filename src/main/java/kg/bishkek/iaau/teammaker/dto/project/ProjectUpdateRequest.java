package kg.bishkek.iaau.teammaker.dto.project;

import lombok.Data;

import java.util.Set;

@Data
public class ProjectUpdateRequest {
    private String name;
    private String type;
    private String sphere;
    private String description;
    private Set<String> requiredSkills;
    private String location;
    private Set<String> team;
}
