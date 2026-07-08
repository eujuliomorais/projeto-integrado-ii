package com.associados.associados.associate.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.associados.associados.associate.dtos.request.CreateCategoryDto;
import com.associados.associados.associate.dtos.response.CategoryResponseDto;
import com.associados.associados.associate.entity.Category;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.associate.repository.CategoryRepository;
import com.associados.associados.auth.infra.exceptions.BusinessException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final AssociateRepository associateRepository;

    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponseDto::new)
                .toList();
    }

    @Transactional
    public CategoryResponseDto createCategory(CreateCategoryDto data) {
        String name = data.name().trim();
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new BusinessException("Category already exists");
        }

        Category category = new Category();
        category.setName(name);
        return new CategoryResponseDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new BusinessException("Category not found");
        }

        if (associateRepository.existsByWorkCategoryId(id)) {
            throw new BusinessException("Category is in use and cannot be deleted");
        }

        categoryRepository.deleteById(id);
    }
}
