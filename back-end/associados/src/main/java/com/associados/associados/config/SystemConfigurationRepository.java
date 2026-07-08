package com.associados.associados.config;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemConfigurationRepository extends JpaRepository<SystemConfiguration, String> {
    Optional<SystemConfiguration> findByConfigKey(String configKey);
}