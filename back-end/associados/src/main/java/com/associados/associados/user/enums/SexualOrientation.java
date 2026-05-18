package com.associados.associados.user.enums;

public enum SexualOrientation {
    HETEROSEXUAL("Heterosexual"),
    HOMOSEXUAL("Homosexual"),
    BISEXUAL("Bisexual"),
    ASEXUAL("Asexual"),
    PANSEXUAL("Pansexual"),
    OTHER("Other");

    private final String displayName;

    SexualOrientation(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
