package com.associados.associados.auth.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.associados.associados.auth.entity.UserDetailsImp;
import com.associados.associados.user.repository.UserRepository;

@Service
public class UserDetailsImpService implements UserDetailsService{
    
    private final UserRepository userRepository;

    public UserDetailsImpService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws org.springframework.security.core.userdetails.UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(UserDetailsImp::new)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found with email: " + email));
    }

}
