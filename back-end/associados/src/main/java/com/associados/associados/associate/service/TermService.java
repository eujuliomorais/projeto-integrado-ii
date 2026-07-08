package com.associados.associados.associate.service;

import org.springframework.stereotype.Service;

import com.associados.associados.associate.dtos.response.TermResponseDto;

@Service
public class TermService {

    private static final String DATA_SHARING_TITLE = "Termo de Compartilhamento de Dados";
    private static final String DATA_SHARING_MESSAGE = """
            Autorizo o compartilhamento dos meus dados cadastrais com parceiros institucionais, órgãos públicos e entidades relacionadas às atividades da associação, exclusivamente para finalidades administrativas, culturais, estatísticas e de promoção de políticas públicas, conforme a legislação de proteção de dados aplicável.
            """;

    public TermResponseDto getDataSharingTerm() {
        return new TermResponseDto(DATA_SHARING_TITLE, DATA_SHARING_MESSAGE.trim());
    }
}
