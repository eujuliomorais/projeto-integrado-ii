package com.associados.associados.user.enums;

public enum Race {
    WHITE("White"),
    BLACK("Black"),
    BROWN("Brown"),
    INDIGENOUS("Indigenous"),
    ASIAN("Asian/Yellow");

    private final String displayName;

    Race(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
