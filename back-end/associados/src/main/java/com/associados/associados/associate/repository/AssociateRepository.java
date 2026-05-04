package com.associados.associados.associate.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.associados.associados.associate.entity.Associate;

@Repository
public interface AssociateRepository extends JpaRepository<Associate, UUID> {
    Optional<Associate> findByCpf(String cpf);
    
    boolean existsByCpf(String cpf);
}