package com.associados.associados.associate.repository;


import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.associados.associados.associate.entity.SelfDeclaration;

@Repository
public interface SelfDeclarationRepository extends JpaRepository<SelfDeclaration, UUID> { }