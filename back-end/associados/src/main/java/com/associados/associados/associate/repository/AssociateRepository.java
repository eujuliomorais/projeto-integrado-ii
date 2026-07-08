package com.associados.associados.associate.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.associados.associados.associate.entity.Associate;

@Repository
public interface AssociateRepository extends JpaRepository<Associate, UUID> {
    Optional<Associate> findByCpf(String cpf);

    Optional<Associate> findByUserId(UUID userId);
    
    boolean existsByCpf(String cpf);
    boolean existsByWorkCategoryId(UUID workCategoryId);

    @Override
    List<Associate> findAll();

    @Query("SELECT a FROM Associate a WHERE MONTH(a.birthDate) = :month AND DAY(a.birthDate) = :day")
    List<Associate> findByBirthdayMonthAndDay(@Param("month") int month, @Param("day") int day);
}