package kg.bishkek.iaau.teammaker.service.impl;

import kg.bishkek.iaau.teammaker.dto.project.ProjectCreateRequest;
import kg.bishkek.iaau.teammaker.dto.project.ProjectListResponse;
import kg.bishkek.iaau.teammaker.dto.project.ProjectResponse;
import kg.bishkek.iaau.teammaker.dto.project.ProjectUpdateRequest;
import kg.bishkek.iaau.teammaker.dto.user.UserListResponse;
import kg.bishkek.iaau.teammaker.exception.BadRequestException;
import kg.bishkek.iaau.teammaker.exception.NotFoundException;
import kg.bishkek.iaau.teammaker.exception.UnauthorizedException;
import kg.bishkek.iaau.teammaker.model.Project;
import kg.bishkek.iaau.teammaker.model.User;
import kg.bishkek.iaau.teammaker.repository.ProjectRepository;
import kg.bishkek.iaau.teammaker.repository.UserRepository;
import kg.bishkek.iaau.teammaker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public ProjectResponse createProject(ProjectCreateRequest request, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found", HttpStatus.NOT_FOUND));

        Project project = new Project();
        project.setName(request.getName());
        project.setType(request.getType());
        project.setSphere(request.getSphere());
        project.setDescription(request.getDescription());
        project.setRequiredSkills(request.getRequiredSkills() != null ? request.getRequiredSkills() : new HashSet<>());
        project.setLocation(request.getLocation());
        project.setTeam(request.getTeam() != null ? request.getTeam() : new HashSet<>());
        project.setOwner(owner);
        project.setMembers(new HashSet<>());
        project.getMembers().add(owner);

        Project savedProject = projectRepository.save(project);
        return mapToProjectResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(UUID projectId) {
        Project project = projectRepository.findByIdAndActiveTrue(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found", HttpStatus.NOT_FOUND));
        return mapToProjectResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectListResponse> getAllProjects() {
        return projectRepository.findByActiveTrue().stream()
                .map(this::mapToProjectListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectListResponse> getProjectsByFilter(String sphere) {
        return projectRepository.findByFilters(sphere).stream()
                .map(this::mapToProjectListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectListResponse> searchProjects(String search) {
        if (search == null || search.trim().isEmpty()) {
            return getAllProjects();
        }
        return projectRepository.searchProjects(search).stream()
                .map(this::mapToProjectListResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse updateProject(UUID projectId, ProjectUpdateRequest request, String username) {
        Project project = projectRepository.findByIdAndActiveTrue(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found", HttpStatus.NOT_FOUND));

        if (!project.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not the owner of this project");
        }

        if (request.getName() != null) project.setName(request.getName());
        if (request.getType() != null) project.setType(request.getType());
        if (request.getSphere() != null) project.setSphere(request.getSphere());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getRequiredSkills() != null) project.setRequiredSkills(request.getRequiredSkills());
        if (request.getLocation() != null) project.setLocation(request.getLocation());
        if (request.getTeam() != null) project.setTeam(request.getTeam());

        Project savedProject = projectRepository.save(project);
        return mapToProjectResponse(savedProject);
    }

    @Override
    public void deleteProject(UUID projectId, String username) {
        Project project = projectRepository.findByIdAndActiveTrue(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found", HttpStatus.NOT_FOUND));

        if (!project.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not the owner of this project");
        }

        project.setActive(false);
        projectRepository.save(project);
    }

    @Override
    public ProjectResponse addMemberToProject(UUID projectId, UUID userId, String username) {
        Project project = projectRepository.findByIdAndActiveTrue(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found", HttpStatus.NOT_FOUND));

        User userToAdd = userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new NotFoundException("User not found", HttpStatus.NOT_FOUND));

        if (project.getMembers().contains(userToAdd)) {
            throw new BadRequestException("User is already a member of this project");
        }

        project.getMembers().add(userToAdd);
        Project savedProject = projectRepository.save(project);
        return mapToProjectResponse(savedProject);
    }

    @Override
    public ProjectResponse removeMemberFromProject(UUID projectId, UUID userId, String username) {
        Project project = projectRepository.findByIdAndActiveTrue(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found", HttpStatus.NOT_FOUND));

        if (!project.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("Only project owner can remove members");
        }

        User userToRemove = userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new NotFoundException("User not found", HttpStatus.NOT_FOUND));

        if (userToRemove.equals(project.getOwner())) {
            throw new BadRequestException("Cannot remove project owner");
        }

        project.getMembers().remove(userToRemove);
        Project savedProject = projectRepository.save(project);
        return mapToProjectResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectListResponse> getUserProjects(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found", HttpStatus.NOT_FOUND));

        return projectRepository.findByOwnerIdAndActiveTrue(user.getId()).stream()
                .map(this::mapToProjectListResponse)
                .collect(Collectors.toList());
    }

    private ProjectResponse mapToProjectResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .type(project.getType())
                .sphere(project.getSphere())
                .description(project.getDescription())
                .requiredSkills(project.getRequiredSkills())
                .location(project.getLocation())
                .team(project.getTeam())
                .owner(mapToUserListResponse(project.getOwner()))
                .members(project.getMembers().stream()
                        .map(this::mapToUserListResponse)
                        .collect(Collectors.toSet()))
                .createdAt(project.getCreatedAt())
                .build();
    }

    private ProjectListResponse mapToProjectListResponse(Project project) {
        return ProjectListResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .type(project.getType())
                .sphere(project.getSphere())
                .description(project.getDescription())
                .requiredSkills(project.getRequiredSkills())
                .location(project.getLocation())
                .ownerUsername(project.getOwner().getUsername())
                .createdAt(project.getCreatedAt())
                .build();
    }

    private UserListResponse mapToUserListResponse(User user) {
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
