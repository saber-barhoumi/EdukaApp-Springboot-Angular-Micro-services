package com.ski.eduka.enums;

public enum PriorityLevel {
    LOW(1), MEDIUM(2), HIGH(3), CRITICAL(4);

    private final int levelCode;

    PriorityLevel(int levelCode) {
        this.levelCode = levelCode;
    }

    public int getLevelCode() {
        return levelCode;
    }
}