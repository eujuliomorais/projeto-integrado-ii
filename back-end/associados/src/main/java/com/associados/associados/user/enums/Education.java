package com.associados.associados.user.enums;

public enum Education {
    NONE("None"),
    PRIMARY("Primary School"),
    SECONDARY("Secondary School"),
    HIGHER("Higher Education"),
    POSTGRADUATE("Postgraduate"),
    MASTER("Master's Degree"),
    PHD("PhD");

    private final String displayName;

    Education(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
