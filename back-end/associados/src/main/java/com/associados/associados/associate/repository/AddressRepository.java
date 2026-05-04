package com.associados.associados.associate.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.associados.associados.associate.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
}