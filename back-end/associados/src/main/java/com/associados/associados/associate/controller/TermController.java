package com.associados.associados.associate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.associate.dtos.response.TermResponseDto;
import com.associados.associados.associate.service.TermService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/terms")
@RequiredArgsConstructor
@Tag(name = "Terms", description = "Endpoints for retrieving application terms")
public class TermController {

    private final TermService termService;

    @GetMapping("/data-sharing")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get data sharing term", description = "Retrieves the text used by the data sharing consent checkbox and PDF.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Term retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<TermResponseDto> getDataSharingTerm() {
        return ResponseEntity.ok(termService.getDataSharingTerm());
    }
}
