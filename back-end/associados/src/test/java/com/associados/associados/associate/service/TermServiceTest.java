package com.associados.associados.associate.service;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;

import com.associados.associados.associate.dtos.response.TermResponseDto;

class TermServiceTest {

    private final TermService termService = new TermService();

    @Test
    void testGetDataSharingTerm_ShouldReturnCorrectTitleAndMessage() {
        
        TermResponseDto result = termService.getDataSharingTerm();

        assertThat(result).isNotNull();
        
        assertThat(result.title()) 
            .isEqualTo("Termo de Compartilhamento de Dados");
            
        assertThat(result.message())
            .contains("Autorizo o compartilhamento dos meus dados")
            .contains("conforme a legislação de proteção de dados aplicável.")
            .isNotBlank();
    }
}