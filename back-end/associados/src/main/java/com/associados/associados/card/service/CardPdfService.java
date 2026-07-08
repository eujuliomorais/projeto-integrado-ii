package com.associados.associados.card.service;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.associados.associados.card.entity.Card;
import com.itextpdf.html2pdf.HtmlConverter;

@Service
public class CardPdfService {

    private static final Path ROOT_LOCATION = Paths.get("/app/uploads");
    private static final String UPLOADS_PREFIX = "/uploads/";

    private static final int PHOTO_WIDTH_PX = 213;
    private static final int PHOTO_HEIGHT_PX = 272;

    @Autowired
    private TemplateEngine templateEngine;

    public byte[] generate(Card card) {
        Context context = new Context();
        context.setVariable("card", card);
        
        context.setVariable("logoBase64", loadBase64FromFile("logo_base64.txt"));
        context.setVariable("sidebarBase64", loadBase64FromFile("sidebar_base64.txt"));
        
        // TENTA buscar a foto, mas se der BusinessException, ignora e segue sem foto (Isso deve ser mudado, não deve emitir se não houver foto!)
        String fotoBase64 = null;
        try {
            if (card.getUser() != null && card.getUser().getAvatarUrl() != null && !card.getUser().getAvatarUrl().isEmpty()) {
                fotoBase64 = getBase64ImageFromFile(card.getUser().getAvatarUrl());
            }
        } catch (Exception e) {
            System.err.println("Aviso: Associado sem foto ou erro ao carregar. Gerando carteirinha sem imagem.");
        }
        
        context.setVariable("fotoBase64", fotoBase64);

        String html = templateEngine.process("carteirinha", context);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        HtmlConverter.convertToPdf(html, outputStream);

        return outputStream.toByteArray();
    }


    private String getBase64ImageFromFile(String avatarUrl) {
        try {
            String fileName = avatarUrl.startsWith(UPLOADS_PREFIX)
                    ? avatarUrl.substring(UPLOADS_PREFIX.length())
                    : avatarUrl;
            Path imagePath = ROOT_LOCATION.resolve(fileName).normalize();

            if (!imagePath.startsWith(ROOT_LOCATION)) {
                throw new java.io.IOException("Invalid avatar path: " + avatarUrl);
            }

            byte[] imageBytes = Files.readAllBytes(imagePath);
            byte[] pngBytes = convertToPng(imageBytes);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngBytes);

        } catch (Exception e) {
            System.err.println("Aviso: Não foi possível carregar a foto do associado. Caminho: " + avatarUrl);
            return null; // Se a foto falhar, a carteirinha é gerada sem a foto (Somente para teste, não deve-se emitir carteira sem foto)
        }
    }

    private byte[] convertToPng(byte[] imageBytes) throws java.io.IOException {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
        if (image == null) {
            throw new java.io.IOException("Formato de imagem não suportado.");
        }

        // Estica a foto para as proporções exatas da moldura, garantindo o preenchimento total
        BufferedImage stretched = new BufferedImage(PHOTO_WIDTH_PX, PHOTO_HEIGHT_PX, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = stretched.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.drawImage(image, 0, 0, PHOTO_WIDTH_PX, PHOTO_HEIGHT_PX, null);
        g2d.dispose();

        ByteArrayOutputStream pngOutput = new ByteArrayOutputStream();
        ImageIO.write(stretched, "png", pngOutput);
        return pngOutput.toByteArray();
    }

    private String loadBase64FromFile(String fileName) {
    try {
        ClassPathResource resource = new ClassPathResource("assets/" + fileName);
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    } catch (Exception e) {
        System.err.println("Erro ao carregar imagem Base64: " + fileName);
        return "";
    }
}
}