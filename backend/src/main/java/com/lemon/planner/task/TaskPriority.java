package com.lemon.planner.task;

public enum TaskPriority {
    LOW, MEDIUM, HIGH;

    @com.fasterxml.jackson.annotation.JsonValue
    public String json() { return name().toLowerCase(); }
}
