package kg.bishkek.iaau.teammaker.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kg.bishkek.iaau.teammaker.dto.project.ProjectCreateRequest;
import kg.bishkek.iaau.teammaker.dto.project.ProjectListResponse;
import kg.bishkek.iaau.teammaker.dto.project.ProjectResponse;
import kg.bishkek.iaau.teammaker.dto.project.ProjectUpdateRequest;
import kg.bishkek.iaau.teammaker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Project management APIs")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody ProjectCreateRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        ProjectResponse project = projectService.createProject(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable UUID projectId) {
        ProjectResponse project = projectService.getProjectById(projectId);
        return ResponseEntity.ok(project);
    }

    @GetMapping
    @Operation(summary = "Get all projects with optional filters")
    public ResponseEntity<List<ProjectListResponse>> getAllProjects(
            @RequestParam(required = false) String sphere,
            @RequestParam(required = false) String search) {
        List<ProjectListResponse> projects;

        if (search != null && !search.trim().isEmpty()) {
            projects = projectService.searchProjects(search);
        } else if (sphere != null && !sphere.trim().isEmpty()) {
            projects = projectService.getProjectsByFilter(sphere);
        } else {
            projects = projectService.getAllProjects();
        }

        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{projectId}")
    @Operation(summary = "Update project")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable UUID projectId,
            @RequestBody ProjectUpdateRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        ProjectResponse project = projectService.updateProject(projectId, request, username);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{projectId}")
    @Operation(summary = "Delete project")
    public ResponseEntity<Void> deleteProject(
            @PathVariable UUID projectId,
            Authentication authentication) {
        String username = authentication.getName();
        projectService.deleteProject(projectId, username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/members/{userId}")
    @Operation(summary = "Add member to project")
    public ResponseEntity<ProjectResponse> addMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication) {
        String username = authentication.getName();
        ProjectResponse project = projectService.addMemberToProject(projectId, userId, username);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @Operation(summary = "Remove member from project")
    public ResponseEntity<ProjectResponse> removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication) {
        String username = authentication.getName();
        ProjectResponse project = projectService.removeMemberFromProject(projectId, userId, username);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/my-projects")
    @Operation(summary = "Get current user's projects")
    public ResponseEntity<List<ProjectListResponse>> getMyProjects(Authentication authentication) {
        String username = authentication.getName();
        List<ProjectListResponse> projects = projectService.getUserProjects(username);
        return ResponseEntity.ok(projects);
    }
}
