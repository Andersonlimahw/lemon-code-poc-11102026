package com.lemon.planner.task;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class TaskExceptionHandler {

    @ExceptionHandler(jakarta.persistence.EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> notFound(jakarta.persistence.EntityNotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of(
            "status", 404,
            "error", "Not Found",
            "message", ex.getMessage() == null ? "recurso não encontrado" : ex.getMessage()
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", 400,
            "error", "Bad Request",
            "message", ex.getBindingResult().getAllErrors().toString()
        ));
    }
}
