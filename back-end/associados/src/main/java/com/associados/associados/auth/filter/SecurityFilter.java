package com.associados.associados.auth.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.associados.associados.auth.service.JWTService;
import com.associados.associados.auth.service.UserDetailsImpService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter{
    
    private final JWTService jwtService;

    private final UserDetailsImpService userDetailsImpService;

    public SecurityFilter(JWTService jwtService, UserDetailsImpService userDetailsImpService) {
        this.jwtService = jwtService;
        this.userDetailsImpService = userDetailsImpService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        var token = this.recoverToken(request);
        if(token != null){
            var login = jwtService.validateToken(token);    
            UserDetails userDetails = userDetailsImpService.loadUserByUsername(login);
            var authentication = new UsernamePasswordAuthenticationToken(userDetails, null,userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request){
        var authHeader = request.getHeader("Authorization");
        if(authHeader == null){
            return null;
        }
        return authHeader.replace("Bearer ", "");
    }
}
