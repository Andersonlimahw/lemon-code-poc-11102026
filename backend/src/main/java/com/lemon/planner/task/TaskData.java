package com.lemon.planner.task;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskData(
        UUID id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        Long position,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TaskData from(Task t) {
        return new TaskData(
                t.getId(), t.getTitle(), t.getDescription(),
                t.getStatus(), t.getPriority(), t.getPosition(),
                t.getCreatedAt(), t.getUpdatedAt()
        );
    }
}
