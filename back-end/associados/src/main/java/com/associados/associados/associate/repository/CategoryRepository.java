package com.associados.associados.associate.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.associados.associados.associate.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    boolean existsByNameIgnoreCase(String name);
}
