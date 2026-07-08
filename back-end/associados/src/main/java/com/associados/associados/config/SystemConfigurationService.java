package com.associados.associados.config;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SystemConfigurationService {

    private final SystemConfigurationRepository configurationRepository;
    public static final String CARD_VALIDITY_KEY = "DEFAULT_CARD_VALIDITY";

    public Optional<LocalDate> getCardValidityConfiguration() {
        return configurationRepository.findByConfigKey(CARD_VALIDITY_KEY)
                .map(SystemConfiguration::getDateValue);
    }

    @Transactional
    public void updateCardValidityConfiguration(LocalDate newValidityDate) {
        SystemConfiguration config = configurationRepository.findByConfigKey(CARD_VALIDITY_KEY)
                .orElseGet(() -> {
                    SystemConfiguration newConfig = new SystemConfiguration();
                    newConfig.setConfigKey(CARD_VALIDITY_KEY);
                    return newConfig;
                });

        config.setDateValue(newValidityDate);
        configurationRepository.save(config);
    }
}