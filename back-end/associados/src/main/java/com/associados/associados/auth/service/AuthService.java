package com.associados.associados.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.associados.associados.auth.dtos.request.LoginAdminDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.user.entity.User;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;
    
    public LoginResponseDto login(LoginAdminDto data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());

        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = jwtService.generateToken((User) auth.getPrincipal());
        return new LoginResponseDto(token, "Login successful");
    }
}