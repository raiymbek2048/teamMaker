package kg.bishkek.iaau.teammaker.repository;

import jakarta.validation.constraints.NotNull;
import kg.bishkek.iaau.teammaker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsernameOrEmailOrPhone(String username, String email, String phone);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByIdAndActiveTrue(UUID id);

    List<User> findByActiveTrue();

    boolean existsByUsername(@NotNull String username);

    boolean existsByEmail(@NotNull String email);

    @Query("SELECT u FROM User u WHERE u.active = true AND " +
           "(LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<User> searchUsers(@Param("search") String search);

}
