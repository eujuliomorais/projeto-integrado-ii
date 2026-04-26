package com.associados.associados.user.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RoleEnum {
    SUPER_ADMIN("Super Administrator"),
    ADMIN("Administrator"),
    CONSULTANT("Consultant"),
    ASSOCIATE("Associate");

    private final String description;
}
