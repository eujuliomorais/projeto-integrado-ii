package com.associados.associados.associate.service;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.associados.associados.associate.dtos.request.CreateCategoryDto;
import com.associados.associados.associate.dtos.response.CategoryResponseDto;
import com.associados.associados.associate.entity.Category;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.associate.repository.CategoryRepository;
import com.associados.associados.auth.infra.exceptions.BusinessException;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private AssociateRepository associateRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Nested
    @DisplayName("Tests for getAllCategories")
    class GetAllCategoriesTests {

        @Test
        @DisplayName("Should return a list of CategoryResponseDto")
        void shouldReturnListOfCategories() {

            Category cat1 = new Category();
            cat1.setId(UUID.randomUUID());
            cat1.setName("TI");

            Category cat2 = new Category();
            cat2.setId(UUID.randomUUID());
            cat2.setName("Saúde");

            when(categoryRepository.findAll()).thenReturn(List.of(cat1, cat2));

            List<CategoryResponseDto> result = categoryService.getAllCategories();

            assertThat(result).hasSize(2);
            assertThat(result.get(0).name()).isEqualTo("TI");
            assertThat(result.get(1).name()).isEqualTo("Saúde");
            verify(categoryRepository, times(1)).findAll();
        }
    }

    @Nested
    @DisplayName("Tests for createCategory")
    class CreateCategoryTests {

        @Test
        @DisplayName("Should create a category successfully when name is unique")
        void shouldCreateCategorySuccessfully() {
  
            CreateCategoryDto inputDto = new CreateCategoryDto("  Design  ");
            Category savedCategory = new Category();
            savedCategory.setId(UUID.randomUUID());
            savedCategory.setName("Design"); 

            when(categoryRepository.existsByNameIgnoreCase("Design")).thenReturn(false);
            when(categoryRepository.save(any(Category.class))).thenReturn(savedCategory);

            CategoryResponseDto result = categoryService.createCategory(inputDto);

            assertThat(result).isNotNull();
            assertThat(result.name()).isEqualTo("Design");
            verify(categoryRepository, times(1)).existsByNameIgnoreCase("Design");
            verify(categoryRepository, times(1)).save(any(Category.class));
        }

        @Test
        @DisplayName("Should throw BusinessException when category name already exists")
        void shouldThrowExceptionWhenCategoryAlreadyExists() {

            CreateCategoryDto inputDto = new CreateCategoryDto("TI");
            when(categoryRepository.existsByNameIgnoreCase("TI")).thenReturn(true);

            assertThatThrownBy(() -> categoryService.createCategory(inputDto))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Category already exists");

            verify(categoryRepository, never()).save(any(Category.class));
        }
    }

    @Nested
    @DisplayName("Tests for deleteCategory")
    class DeleteCategoryTests {

        @Test
        @DisplayName("Should delete category successfully when it exists and is not in use")
        void shouldDeleteCategorySuccessfully() {

            UUID categoryId = UUID.randomUUID();
            when(categoryRepository.existsById(categoryId)).thenReturn(true);
            when(associateRepository.existsByWorkCategoryId(categoryId)).thenReturn(false);

            categoryService.deleteCategory(categoryId);

            verify(categoryRepository, times(1)).deleteById(categoryId);
        }

        @Test
        @DisplayName("Should throw BusinessException when category to delete does not exist")
        void shouldThrowExceptionWhenCategoryNotFound() {

            UUID categoryId = UUID.randomUUID();
            when(categoryRepository.existsById(categoryId)).thenReturn(false);

            assertThatThrownBy(() -> categoryService.deleteCategory(categoryId))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Category not found");

            verify(associateRepository, never()).existsByWorkCategoryId(any());
            verify(categoryRepository, never()).deleteById(any());
        }

        @Test
        @DisplayName("Should throw BusinessException when category is in use by an associate")
        void shouldThrowExceptionWhenCategoryIsInUse() {

            UUID categoryId = UUID.randomUUID();
            when(categoryRepository.existsById(categoryId)).thenReturn(true);
            when(associateRepository.existsByWorkCategoryId(categoryId)).thenReturn(true);

            assertThatThrownBy(() -> categoryService.deleteCategory(categoryId))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Category is in use and cannot be deleted");

            verify(categoryRepository, never()).deleteById(any());
        }
    }
}