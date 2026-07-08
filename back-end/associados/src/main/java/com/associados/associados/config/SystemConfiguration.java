package com.associados.associados.config;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "system_configurations")
@Getter
@Setter
@NoArgsConstructor
public class SystemConfiguration {

    @Id
    @Column(length = 50)
    private String configKey;

    @Column(nullable = false)
    private LocalDate dateValue;
}