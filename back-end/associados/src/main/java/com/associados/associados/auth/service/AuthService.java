package com.associados.associados.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.associados.associados.auth.dtos.request.AccessKeyLoginDto;
import com.associados.associados.auth.dtos.request.LoginAdminDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public LoginResponseDto login(LoginAdminDto data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());

        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = jwtService.generateToken((User) auth.getPrincipal());
        return new LoginResponseDto(token, "Login successful");
    }

    public LoginResponseDto loginAccessManager(AccessKeyLoginDto data) {
        User superAdmin = userRepository.findByRole(RoleEnum.SUPER_ADMIN)
            .orElseThrow(() -> new BusinessException("Super Admin not found"));

        if (superAdmin.getAccessKeyHash() == null) {
            throw new BusinessException("Access key not configured for Super Admin");
        }

        if (!passwordEncoder.matches(data.accessKey(), superAdmin.getAccessKeyHash())) {
            throw new BusinessException("Invalid access key");
        }

        var token = jwtService.generateToken(superAdmin);
        return new LoginResponseDto(token, "Login successful");
    }
}
