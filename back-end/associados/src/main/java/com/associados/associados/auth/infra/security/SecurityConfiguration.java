package com.associados.associados.auth.infra.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.associados.associados.auth.filter.SecurityFilter;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@OpenAPIDefinition(info = @Info(title = "Associados API", version = "v1"))
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer"
)

@RequiredArgsConstructor
public class SecurityConfiguration {

    private final SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> {}) // activate CORS
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    req.requestMatchers("/auth/login", "/auth/access-manager/login", "/auth/magic-link/**").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/auth/password/forgot", "/auth/password/validate").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/auth/password/reset").hasAuthority("PASSWORD_RESET");
                    req.requestMatchers("/error/**").permitAll();
                    req.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/uploads/**").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/terms/data-sharing").permitAll(); //temporário (depois revisar permissões)
                    req.requestMatchers(HttpMethod.GET, "/cards/validate").permitAll(); //pagina publica
                    
                    req.requestMatchers(HttpMethod.POST, "/admins").hasRole("SUPER_ADMIN");
                    req.requestMatchers(HttpMethod.PATCH, "/auth/access-manager/reset-password").hasRole("SUPER_ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/associates").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.GET, "/associates/me").hasRole("ASSOCIATE");
                    req.requestMatchers(HttpMethod.GET, "/cards/me").hasRole("ASSOCIATE");
                    req.requestMatchers(HttpMethod.GET, "/cards/me/download").hasRole("ASSOCIATE");
                    req.requestMatchers(HttpMethod.PUT, "/cards/renew/*").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/cards/*/send-email").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.GET, "/associates").hasAnyRole("ADMIN", "CONSULTANT");
                    req.requestMatchers(HttpMethod.GET, "/associates/**").hasAnyRole("ADMIN", "CONSULTANT");
                    req.requestMatchers(HttpMethod.PATCH, "/associates/me/self-declaration").hasRole("ASSOCIATE");
                    req.requestMatchers(HttpMethod.PATCH, "/associates/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/associates/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.GET, "/categories").hasAnyRole("ADMIN", "CONSULTANT");
                    req.requestMatchers(HttpMethod.GET, "/categories/**").hasAnyRole("ADMIN", "CONSULTANT");
                    req.requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/categories/**").hasRole("ADMIN");
                    req.requestMatchers("/mailing/**").hasAnyRole("ADMIN");
                    req.requestMatchers(HttpMethod.PATCH, "/management/users/me/contact").hasAnyRole("ADMIN", "CONSULTANT");
                    req.requestMatchers(HttpMethod.PATCH, "/management/users/me/password").hasAnyRole("ADMIN", "CONSULTANT");
                    req.requestMatchers("/management/**").hasRole("SUPER_ADMIN");
                    req.requestMatchers(HttpMethod.PUT, "/cards/settings/validity").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/users/upload-avatar").authenticated();
                    req.requestMatchers(HttpMethod.PATCH, "/users/*/avatar").authenticated();
                    req.requestMatchers(HttpMethod.DELETE, "/users/*/avatar").hasAnyRole("ADMIN", "SUPER_ADMIN");
                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // CORS config
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // TODO: replace with custom variable
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}