package kg.bishkek.iaau.teammaker.service;

import kg.bishkek.iaau.teammaker.dto.project.ProjectCreateRequest;
import kg.bishkek.iaau.teammaker.dto.project.ProjectListResponse;
import kg.bishkek.iaau.teammaker.dto.project.ProjectResponse;
import kg.bishkek.iaau.teammaker.dto.project.ProjectUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    ProjectResponse createProject(ProjectCreateRequest request, String username);

    ProjectResponse getProjectById(UUID projectId);

    List<ProjectListResponse> getAllProjects();

    List<ProjectListResponse> getProjectsByFilter(String sphere);

    List<ProjectListResponse> searchProjects(String search);

    ProjectResponse updateProject(UUID projectId, ProjectUpdateRequest request, String username);

    void deleteProject(UUID projectId, String username);

    ProjectResponse addMemberToProject(UUID projectId, UUID userId, String username);

    ProjectResponse removeMemberFromProject(UUID projectId, UUID userId, String username);

    List<ProjectListResponse> getUserProjects(String username);
}
