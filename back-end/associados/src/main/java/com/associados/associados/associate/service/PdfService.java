package com.associados.associados.associate.service;

import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.repository.AssociateRepository;
import com.itextpdf.html2pdf.HtmlConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
public class PdfService {

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private AssociateRepository associateRepository;

    public byte[] generateFichaCadastralPdf(UUID associateId) {
        Associate associate = associateRepository.findById(associateId)
                .orElseThrow(() -> new RuntimeException("Associado não encontrado"));

        Context context = new Context();
        context.setVariable("associado", associate);

        try (InputStream is = new ClassPathResource("assets/logo_base64.txt").getInputStream()) {
            String logoBase64 = new String(is.readAllBytes(), StandardCharsets.UTF_8).trim();
            context.setVariable("logoBase64", logoBase64);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao carregar logo para a ficha cadastral", e);
        }

        String html = templateEngine.process("ficha-cadastral", context);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        HtmlConverter.convertToPdf(html, outputStream);

        return outputStream.toByteArray();
    }
}