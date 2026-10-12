package com.lemon.planner.task;

public record TaskRequestPayload(
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        Long position
) {}
