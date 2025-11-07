package kg.bishkek.iaau.teammaker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects", indexes = {
        @Index(columnList = "name", name = "idx_project_name"),
        @Index(columnList = "sphere", name = "idx_project_sphere")
})
@Getter
@Setter
public class Project extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column
    private String type;

    @Column
    private String sphere;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "project_required_skills", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "skill")
    private Set<String> requiredSkills = new HashSet<>();

    @Column
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToMany
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "project_team", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "team_member")
    private Set<String> team = new HashSet<>();
}
