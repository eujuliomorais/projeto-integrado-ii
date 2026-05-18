package com.associados.associados.user.enums;

public enum Disability {
    PHYSICAL("Physical"),
    VISUAL("Visual"),
    HEARING("Hearing"),
    INTELLECTUAL("Intellectual"),
    SENSORY("Sensory"),
    MENTAL("Mental");

    private final String displayName;

    Disability(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
