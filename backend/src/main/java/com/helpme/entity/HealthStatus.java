package com.helpme.entity;

public enum HealthStatus {
    GOOD("Gut", "#22c55e"),      // Grün
    WARNING("Achtung", "#eab308"), // Gelb
    EMERGENCY("Not", "#ef4444");   // Rot

    private final String label;
    private final String color;

    HealthStatus(String label, String color) {
        this.label = label;
        this.color = color;
    }

    public String getLabel() {
        return label;
    }

    public String getColor() {
        return color;
    }
}
