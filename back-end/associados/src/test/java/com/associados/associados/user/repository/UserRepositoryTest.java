package com.associados.associados.user.repository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;

@DataJpaTest
@ActiveProfiles("tests") 
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User persistUser(String email, String name, RoleEnum role) {
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setRole(role);
        user.setPassword("encoded_password");
        
        this.entityManager.persist(user);
        return user;
    }

    @Test
    @DisplayName("Should find user by email when it exists in database")
    void testFindByEmailSuccess() { 
        String email = "john.doe@gmail.com";
        this.persistUser(email, "John Doe", RoleEnum.ADMIN);
        
        Optional<User> result = this.userRepository.findByEmail(email);

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo(email);
    }

    @Test
    @DisplayName("Should return empty optional when user does not exist")
    void testFindByEmailFail() {
        Optional<User> result = this.userRepository.findByEmail("nonexistent@gmail.com");
        
        assertThat(result).isEmpty();
    }
}