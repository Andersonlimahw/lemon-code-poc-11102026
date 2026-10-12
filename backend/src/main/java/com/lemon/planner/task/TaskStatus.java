package com.lemon.planner.task;

public enum TaskStatus {
    TODO, IN_PROGRESS, REVIEW, DONE;

    @com.fasterxml.jackson.annotation.JsonValue
    public String json() { return name().toLowerCase(); }
}
