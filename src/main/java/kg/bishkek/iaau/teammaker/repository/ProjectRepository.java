package kg.bishkek.iaau.teammaker.repository;

import kg.bishkek.iaau.teammaker.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByActiveTrue();

    Optional<Project> findByIdAndActiveTrue(UUID id);

    List<Project> findByOwnerIdAndActiveTrue(UUID ownerId);

    List<Project> findBySphereAndActiveTrue(String sphere);

    @Query("SELECT p FROM Project p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Project> searchProjects(@Param("search") String search);

    @Query("SELECT p FROM Project p WHERE p.active = true AND " +
           "(:sphere IS NULL OR p.sphere = :sphere)")
    List<Project> findByFilters(@Param("sphere") String sphere);
}
