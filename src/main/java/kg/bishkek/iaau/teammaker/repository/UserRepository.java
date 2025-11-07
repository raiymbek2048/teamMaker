package kg.bishkek.iaau.teammaker.repository;

import jakarta.validation.constraints.NotNull;
import kg.bishkek.iaau.teammaker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsernameOrEmailOrPhoneNumber(String username, String email, String phoneNumber);
    Optional<User> findByUsername(String username);

    boolean existsByUsername(@NotNull String username);

    boolean existsByEmail(@NotNull String email);

    boolean existsByPhoneNumber(@NotNull String phoneNumber);

}
