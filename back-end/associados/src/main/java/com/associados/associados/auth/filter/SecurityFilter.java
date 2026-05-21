package com.associados.associados.auth.filter;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.associados.associados.auth.service.JWTService;
import com.associados.associados.user.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        var token = this.recoverToken(request);
        if(token != null){
            if (isPasswordResetRequest(request)) {
                authenticatePasswordResetToken(token);
                filterChain.doFilter(request, response);
                return;
            }

            var login = jwtService.validateToken(token);
            if (login != null) {
                var user = userRepository.findByEmail(login).orElse(null);
                if (user != null) {
                    var authorities = user.getAuthorities();
                    log.debug("User {} authenticated with authorities: {}", user.getEmail(), authorities);
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    log.warn("User not found in database for email: {}", login);
                }
            } else {
                log.warn("Invalid or expired token provided");
            }
        }
        filterChain.doFilter(request, response);
    }

    private void authenticatePasswordResetToken(String token) {
        var tokenData = jwtService.validatePasswordResetToken(token);
        if (tokenData != null) {
            var authorities = List.of(new SimpleGrantedAuthority("PASSWORD_RESET"));
            var authentication = new UsernamePasswordAuthenticationToken(tokenData, token, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            log.warn("Invalid or expired password reset token provided");
        }
    }

    private boolean isPasswordResetRequest(HttpServletRequest request) {
        return "POST".equals(request.getMethod()) && "/auth/password/reset".equals(request.getServletPath());
    }

    private String recoverToken(HttpServletRequest request){
        var authHeader = request.getHeader("Authorization");
        if(authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}
