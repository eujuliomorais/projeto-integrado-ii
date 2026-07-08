package com.associados.associados.user.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}/avatar")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> getAvatar(@PathVariable java.util.UUID id) {
        String avatarUrl = userService.getAvatarUrl(id);
        if (avatarUrl == null || avatarUrl.isBlank()) {
            throw new BusinessException("Usuário não possui foto de perfil.");
        }
        return ResponseEntity.ok(avatarUrl);
    }

    @PostMapping(value = "/upload-avatar", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        
        if (user == null) {
            throw new BusinessException("Unauthenticated user.");
        }

        if (file.isEmpty()) {
            throw new BusinessException("Please select a file to upload.");
        }
        
        String urlFinal = userService.salvarEAtualizarAvatar(user.getId(), file);
        
        return ResponseEntity.ok(urlFinal);
    }

    @PatchMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> patchAvatar(
            @PathVariable java.util.UUID id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            throw new BusinessException("Unauthenticated user.");
        }

        if (!user.getId().equals(id)) {
            throw new BusinessException("You can only change your own photo.");
        }

        if (file.isEmpty()) {
            throw new BusinessException("Please select a file to upload.");
        }

        return ResponseEntity.ok(userService.patchAvatar(id, file));
    }

    @DeleteMapping("/{id}/avatar")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteAvatar(
            @PathVariable java.util.UUID id,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            throw new BusinessException("Unauthenticated user.");
        }

        if (!user.getId().equals(id)) {
            throw new BusinessException("You can only change your own photo.");
        }

        userService.deleteAvatar(id);
        return ResponseEntity.noContent().build();
    }
}
