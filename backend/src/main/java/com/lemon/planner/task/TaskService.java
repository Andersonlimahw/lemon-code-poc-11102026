package com.lemon.planner.task;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repo;

    public TaskData create(TaskRequestPayload p) {
        Task task = Task.builder()
                .title(p.title())
                .description(p.description())
                .status(p.status() != null ? p.status() : TaskStatus.TODO)
                .priority(p.priority() != null ? p.priority() : TaskPriority.MEDIUM)
                .position(p.position() != null ? p.position() : 0L)
                .build();
        return TaskData.from(repo.save(task));
    }

    public List<TaskData> listAll() {
        return repo.findAllByOrderByStatusAscPositionAsc().stream()
                .map(TaskData::from)
                .toList();
    }

    public TaskData get(UUID id) {
        return repo.findById(id)
                .map(TaskData::from)
                .orElseThrow(() -> new EntityNotFoundException("Task " + id + " não encontrada"));
    }

    public TaskData update(UUID id, TaskRequestPayload p) {
        Task task = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task " + id + " não encontrada"));
        if (p.title() != null) task.setTitle(p.title());
        if (p.description() != null) task.setDescription(p.description());
        if (p.status() != null) task.setStatus(p.status());
        if (p.priority() != null) task.setPriority(p.priority());
        if (p.position() != null) task.setPosition(p.position());
        return TaskData.from(repo.save(task));
    }

    public TaskData move(UUID id, TaskStatus newStatus, Long newPosition) {
        Task task = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task " + id + " não encontrada"));
        task.setStatus(newStatus);
        task.setPosition(newPosition);
        return TaskData.from(repo.save(task));
    }

    public void delete(UUID id) {
        repo.deleteById(id);
    }
}
