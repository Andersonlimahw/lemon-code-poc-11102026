package com.lemon.planner.task;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService service;

    @PostMapping
    public ResponseEntity<TaskData> create(@RequestBody TaskRequestPayload p) {
        return ResponseEntity.status(201).body(service.create(p));
    }

    @GetMapping
    public List<TaskData> list() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public TaskData get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PatchMapping("/{id}")
    public TaskData update(@PathVariable UUID id, @RequestBody TaskRequestPayload p) {
        return service.update(id, p);
    }

    @PatchMapping("/{id}/move")
    public TaskData move(@PathVariable UUID id,
                         @RequestParam("status") String statusRaw,
                         @RequestParam("position") Long position) {
        TaskStatus s;
        try { s = TaskStatus.valueOf(statusRaw.trim().toUpperCase()); }
        catch (IllegalArgumentException e) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, "status inválido: " + statusRaw);
        }
        return service.move(id, s, position);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
