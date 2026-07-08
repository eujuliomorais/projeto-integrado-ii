package com.associados.associados.message;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, String> {
    Optional<Message> findByMessageKey(String messageKey);
}
