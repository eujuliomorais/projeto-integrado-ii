package com.associados.associados.message;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public static final String BIRTHDAY_MESSAGE_KEY = "BIRTHDAY_MESSAGE";

    private static final String DEFAULT_BIRTHDAY_MESSAGE = "Desejamos a você um aniversário repleto de alegria, saúde e momentos inesquecíveis! "
            + "Que este novo ciclo seja cheio de realizações e felicidade. Obrigado por fazer parte da "
            + "nossa comunidade no Centro Cultural Dom Maurício.";

    public String getBirthdayMessage() {
        return messageRepository.findByMessageKey(BIRTHDAY_MESSAGE_KEY)
                .map(Message::getContent)
                .orElse(DEFAULT_BIRTHDAY_MESSAGE);
    }

    @Transactional
    public void updateBirthdayMessage(String newContent) {
        Message message = messageRepository.findByMessageKey(BIRTHDAY_MESSAGE_KEY)
                .orElseGet(() -> {
                    Message newMessage = new Message();
                    newMessage.setMessageKey(BIRTHDAY_MESSAGE_KEY);
                    return newMessage;
                });

        message.setContent(newContent);
        messageRepository.save(message);
    }
}
