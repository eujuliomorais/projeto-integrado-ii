package com.associados.associados.card.entity;

import java.time.LocalDate;
import java.util.UUID;

import com.associados.associados.associate.entity.Associate;
import com.associados.associados.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "associate_id", nullable = false, unique = true)
    private Associate associate;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String socialName;

    @Column(nullable = false, length = 11)
    private String cpf;

    @Column(nullable = false)
    private LocalDate validity;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private com.associados.associados.associate.entity.Category category;

    @Column(nullable = false, unique = true, length = 5)
    private String number;
}
