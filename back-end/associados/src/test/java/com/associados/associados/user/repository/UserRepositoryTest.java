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

import com.associados.associados.auth.dtos.request.RegisterUserDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;

@DataJpaTest
@ActiveProfiles("tests") 
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User createUser(RegisterUserDto data) {
        User user = new User(data);
        this.entityManager.persist(user);
        this.entityManager.flush(); 
        return user;
    }

    @Test
    @DisplayName("Should find user by email")
    private void testFindByEmailSucess() {
        RegisterUserDto data = new RegisterUserDto(
            "testador@gmail.com",  
            "password123",          
            "Testador",            
            RoleEnum.ADMIN          
        );
        
        this.createUser(data);
        
        Optional<User> result = this.userRepository.findByEmail(data.email());

        assertThat(result.isPresent()).isTrue();
    }

    @Test
    @DisplayName("Should not find user by email")
    private void testFindByEmailFail() {
        Optional<User> result = this.userRepository.findByEmail("nonexistent@gmail.com");
        assertThat(result.isPresent()).isFalse();
    }
}