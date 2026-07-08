package com.associados.associados.associate.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.associate.dtos.request.CreateCategoryDto;
import com.associados.associados.associate.dtos.response.CategoryResponseDto;
import com.associados.associados.associate.service.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "Endpoints for managing associate registration categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List categories", description = "Retrieves all registration categories.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Categories retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<List<CategoryResponseDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create category", description = "Creates a new associate registration category.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Category created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid category data"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CategoryResponseDto> createCategory(@RequestBody @Valid CreateCategoryDto data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(data));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete category", description = "Deletes a category that is not being used by associates.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Category does not exist or is in use"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
