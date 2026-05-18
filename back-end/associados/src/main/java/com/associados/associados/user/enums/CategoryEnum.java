package com.associados.associados.user.enums;

public enum CategoryEnum {
    ARTIST("Artist"), 
    PRODUCER("Producer"), 
    TECHNICIAN("Technician"), 
    OTHER("Other"),
    NONE("None");

    private final String displayName;

    CategoryEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
