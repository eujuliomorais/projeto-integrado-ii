package com.associados.associados.user.enums;

public enum Role {
    ADMINISTRATOR("Administrator"),
    CONSULTANT("Consultant"),
    SUPER_ADMIN("Super Admin"),
    ASSOCIATE("Associate");

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
