package com.associados.associados.auth.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.associados.associados.auth.entity.AuthToken;
import com.associados.associados.user.entity.User;

@Service
public class JWTService {

    private static final String ACCESS_TOKEN_TYPE = "ACCESS";
    private static final String PASSWORD_RESET_TOKEN_TYPE = "PASSWORD_RESET";

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("associados-api")
                    .withSubject(user.getEmail())
                    .withClaim("type", ACCESS_TOKEN_TYPE)
                    .withClaim("role", user.getRole().toString())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while generating token", exception);
        }
    }

    public String generatePasswordResetToken(AuthToken authToken) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("associados-api")
                    .withSubject(authToken.getUser().getEmail())
                    .withClaim("type", PASSWORD_RESET_TOKEN_TYPE)
                    .withClaim("authTokenId", authToken.getId().toString())
                    .withExpiresAt(generatePasswordResetExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while generating password reset token", exception);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer("associados-api")
                    .build()
                    .verify(token);

            if (!ACCESS_TOKEN_TYPE.equals(decodedJWT.getClaim("type").asString())) {
                return null;
            }

            return decodedJWT.getSubject();
        } catch (JWTVerificationException exception) {
            return null; //403
        }
    }

    public PasswordResetTokenData validatePasswordResetToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer("associados-api")
                    .build()
                    .verify(token);

            if (!PASSWORD_RESET_TOKEN_TYPE.equals(decodedJWT.getClaim("type").asString())) {
                return null;
            }

            return new PasswordResetTokenData(
                    decodedJWT.getSubject(),
                    decodedJWT.getClaim("authTokenId").asString()
            );
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusMinutes(60).toInstant(ZoneOffset.of("-03:00"));
    }

    private Instant generatePasswordResetExpirationDate() {
        return LocalDateTime.now().plusMinutes(15).toInstant(ZoneOffset.of("-03:00"));
    }

    public record PasswordResetTokenData(String email, String authTokenId) {}
}
