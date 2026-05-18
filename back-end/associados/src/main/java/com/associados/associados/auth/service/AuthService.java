package com.associados.associados.auth.service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.associados.associados.auth.dtos.request.LoginDto;
import com.associados.associados.auth.dtos.request.RegisterCompleteUserDto;
import com.associados.associados.auth.dtos.request.RegisterManagementUserDto;
import com.associados.associados.auth.dtos.request.ResetPasswordDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.auth.entity.UserDetailsImp;
import com.associados.associados.auth.exceptions.AlreadyVerifiedException;
import com.associados.associados.auth.exceptions.ExpiredVerificationCodeException;
import com.associados.associados.auth.exceptions.InvalidVerificationCodeException;
import com.associados.associados.auth.exceptions.PasswordMismatchException;
import com.associados.associados.auth.exceptions.SendVerificationMailException;
import com.associados.associados.email.EmailService;
import com.associados.associados.user.dtos.request.PatchUserEmailDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.CategoryEnum;
import com.associados.associados.user.enums.Role;
import com.associados.associados.user.exceptions.ResourceNotFoundException;
import com.associados.associados.user.repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    private static final long VERIFICATION_CODE_EXPIRY_MINUTES = 5;
    private static final long PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = 15;

    public LoginResponseDto login(LoginDto data) throws Exception{
        try{
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var  auth = this.authenticationManager.authenticate(usernamePassword);

            UserDetailsImp userDetails = (UserDetailsImp) auth.getPrincipal();
            User user = userDetails.getUser();
            
            if(user.isEnabled()   == false){
                throw new ResourceNotFoundException("User not found");
            }

            var token = jwtService.generateToken(user);
            return new LoginResponseDto(token);
        }catch (AuthenticationException e) {
            return new LoginResponseDto("Invalid email or password");
        }
    }

    @Transactional
    public void createAdminOrConsultantUser(RegisterManagementUserDto data) throws Exception {
        if(userRepository.findByEmail(data.email()).isPresent()) {
            throw new Exception("Email already exists!");
        }
        if(userRepository.findByCpf(data.cpf()).isPresent()) {
            throw new Exception("CPF already exists!");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User user = new User();
        user.setName(data.name());
        user.setEmail(data.email());
        user.setCpf(data.cpf());
        user.setPhoneNumber(data.phoneNumber());
        user.setPassword(encryptedPassword);
        user.setRole(data.role()); 
        user.setBirthDate(null);
        user.setCategory(CategoryEnum.NONE);
        user.setPostalCode("");
        user.setStreet("");
        user.setNumber("");
        user.setNeighborhood("");
        user.setCity("");
        user.setState("");
        user.setRace(null);
        user.setSexualOrientation(null);
        user.setEducation(null);
        user.setDisabilities(null);

        generateAndSetVerificationCode(user); 
        userRepository.save(user);
    }

    @Transactional
    public void createAssociateUser(RegisterManagementUserDto data, RegisterCompleteUserDto completeData) throws Exception {
        if(userRepository.findByEmail(data.email()).isPresent()) {
            throw new Exception("Email already exists!");
        }
        if(userRepository.findByCpf(data.cpf()).isPresent()) {
            throw new Exception("CPF already exists!");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User user = new User();
        user.setName(data.name());
        user.setEmail(data.email());
        user.setCpf(data.cpf());
        user.setPhoneNumber(data.phoneNumber());
        user.setPassword(encryptedPassword);
        user.setRole(Role.ASSOCIATE);
        user.setBirthDate(completeData.birthDate());
        if(completeData.birthDate().isAfter(LocalDate.now().minusYears(18))) {
            user.setLegalGuardianName(completeData.LegalGuardianName());
        } 
        user.setCategory(completeData.workCategory());
        user.setPostalCode(completeData.postalCode());
        user.setStreet(completeData.street());
        user.setNumber(completeData.number());
        user.setNeighborhood(completeData.neighborhood());
        user.setCity(completeData.city());
        user.setState(completeData.state());
        user.setRace(completeData.race());
        user.setSexualOrientation(completeData.sexualOrientation());
        user.setEducation(completeData.education());
        user.setDisabilities(completeData.disabilities());

        generateAndSetVerificationCode(user); 
        userRepository.save(user);
    }

    private void generateAndSetVerificationCode(User user){
        String code = generateRandomCode();
        user.setVerificationCode(code);
        user.setVerificationCodeExpiry(
            LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES)
        );

        try {
            emailService.sendVerificationEmail(user.getEmail(), code);
        } catch (MessagingException e) {
            throw new SendVerificationMailException("Failed to send verification email: " + e.getMessage());
        }
    }

    public void resendVerificationCode(String email) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);
        
        if(user.isEmpty()){ 
            throw new ResourceNotFoundException("User with email " + email + " not found");
        }
        
        if(user.get().isEnabled()) {
            throw new AlreadyVerifiedException("User already verified");
        }
        
        User actualUser = user.get();
        if (actualUser.getVerificationCode() != null) {
            throw new Exception("Verification code already sent. Please wait before requesting a new one.");
        }
        generateAndSetVerificationCode(actualUser);
        userRepository.save(actualUser);
    }

    @Transactional
    public void verifyUser(String email, String code) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);
        
        if(user.isEmpty()){
            throw new ResourceNotFoundException("User with email " + email + " not found");
        }

        User actualUser = user.get();

        if (actualUser.isEnabled()) {
            throw new AlreadyVerifiedException("User already verified");
        }

        if (!code.equals(actualUser.getVerificationCode())) {
            throw new InvalidVerificationCodeException("Invalid verification code");
        }

        if (LocalDateTime.now().isAfter(actualUser.getVerificationCodeExpiry())) {
            throw new ExpiredVerificationCodeException("Verification code expired");
        }

        actualUser.setEnabled(true);
        actualUser.setVerificationCode(null);
        actualUser.setVerificationCodeExpiry(null);
        emailService.sendVerifyMessage(actualUser.getEmail());
    }

    @Transactional
    public void requestPasswordReset(PatchUserEmailDto emailDto) throws Exception {
        String email = emailDto.email();
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException("Email not found");
        }

        User user = userOptional.get();
        String resetToken = generateRandomCode();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(
            LocalDateTime.now().plusMinutes(PASSWORD_RESET_TOKEN_EXPIRY_MINUTES)
        );
        userRepository.save(user);

        emailService.sendForgotPasswordEmail(email, resetToken);
    }

    @Transactional
    public void resetPassword(ResetPasswordDto data) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(data.email());
        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException("If the user exists, a recovery email has been sent");
        }

        User user = userOptional.get();
        
        if (!data.token().equals(user.getPasswordResetToken())) {
            throw new InvalidVerificationCodeException("Invalid reset token");
        }
        if (LocalDateTime.now().isAfter(user.getPasswordResetTokenExpiry())) {
            throw new ExpiredVerificationCodeException("Reset token expired");
        }
        if(!data.newPassword().equals(data.confirmPassword()) ) {
            throw new PasswordMismatchException("Passwords do not match");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.newPassword());
        user.setPassword(encryptedPassword);
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
    }

    private String generateRandomCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder(6);
        
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10));
        }
        
        return code.toString();
    }

}
