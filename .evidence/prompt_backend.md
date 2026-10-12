ATENÇÃO: O cwd atual JÁ É /Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026 (monorepo desta POC). NÃO navegue para outro lugar.

Backend Spring Boot 3.3.1 (Java 21) está em ./backend (boilerplate já presente). Use `find ./backend/src/main/java/com/lemon/planner` e leia os arquivos Activity/Link/Participant/Trip para extrair o padrão (Lombok, @Entity, @Repository, @Service, @RestController, records com @Data, flyway migrations em backend/src/main/resources/db/migration).

OBJETIVO ÚNICO: implementar 100% o backend CRUD de Tasks para um Kanban de TODO. Crie arquivos APENAS dentro de:
- backend/src/main/java/com/lemon/planner/task/**
- backend/src/main/resources/db/migration/V1__create_tasks.sql

NÃO modifique nada em ./frontend. NÃO toque em pacotes activity/participant/link/trip. NÃO toque em pom.xml (dependências já bastam). NÃO altere PlannerApplication.java.

ENTREGÁVEIS:

Arquivo 1) backend/src/main/java/com/lemon/planner/task/TaskStatus.java
- public enum TaskStatus { TODO, IN_PROGRESS, REVIEW, DONE; }
- @com.fasterxml.jackson.annotation.JsonValue public String json() { return name().toLowerCase(); }

Arquivo 2) backend/src/main/java/com/lemon/planner/task/TaskPriority.java
- public enum TaskPriority { LOW, MEDIUM, HIGH; }
- @com.fasterxml.jackson.annotation.JsonValue public String json() { return name().toLowerCase(); }

Arquivo 3) backend/src/main/java/com/lemon/planner/task/Task.java
@Entity @lombok.Getter @lombok.Setter @lombok.NoArgsConstructor @lombok.AllArgsConstructor @lombok.Builder
- @Id @GeneratedValue private java.util.UUID id;
- @Column(nullable=false, length=200) private String title;
- @Column(columnDefinition="TEXT") private String description;
- @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private TaskStatus status = TaskStatus.TODO;
- @Enumerated(EnumType.STRING) @Column(nullable=false, length=10) private TaskPriority priority = TaskPriority.MEDIUM;
- @Column(nullable=false) private Long position = 0L;
- @org.hibernate.annotations.CreationTimestamp private java.time.LocalDateTime createdAt;
- @org.hibernate.annotations.UpdateTimestamp private java.time.LocalDateTime updatedAt;

Arquivo 4) backend/src/main/java/com/lemon/planner/task/TaskRepository.java
public interface TaskRepository extends org.springframework.data.jpa.repository.JpaRepository<Task, java.util.UUID> {
  java.util.List<Task> findAllByOrderByStatusAscPositionAsc();
  java.util.List<Task> findAllByStatusOrderByPositionAsc(TaskStatus status);
}

Arquivo 5) backend/src/main/java/com/lemon/planner/task/TaskRequestPayload.java
public record TaskRequestPayload(
  @jakarta.validation.constraints.NotBlank String title,
  String description,
  TaskStatus status,
  TaskPriority priority,
  Long position
) {}

Arquivo 6) backend/src/main/java/com/lemon/planner/task/TaskData.java
public record TaskData(
  java.util.UUID id, String title, String description, TaskStatus status, TaskPriority priority,
  Long position, java.time.LocalDateTime createdAt, java.time.LocalDateTime updatedAt
) {
  public static TaskData from(Task t) {
    return new TaskData(t.getId(), t.getTitle(), t.getDescription(), t.getStatus(), t.getPriority(), t.getPosition(), t.getCreatedAt(), t.getUpdatedAt());
  }
}

Arquivo 7) backend/src/main/java/com/lemon/planner/task/TaskService.java
- @Service @RequiredArgsConstructor
- injetar TaskRepository repo
- create(TaskRequestPayload p): entity nova (defaults aplicados), save, return TaskData.from
- listAll(): repo.findAllByOrderByStatusAscPositionAsc().stream().map(TaskData::from).toList()
- get(UUID id): repo.findById(id).map(TaskData::from).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Task " + id + " não encontrada"))
- update(UUID id, TaskRequestPayload p): get-or-throw, mutar campos não-nulos, save, TaskData.from
- move(UUID id, TaskStatus newStatus, Long newPosition): get-or-throw, set status e position, save, TaskData.from
- delete(UUID id): repo.deleteById(id)

Arquivo 8) backend/src/main/java/com/lemon/planner/task/TaskController.java
- @RestController @RequestMapping("/api/tasks") @CrossOrigin(origins = "http://localhost:5173") @RequiredArgsConstructor
- injetar TaskService service
- @PostMapping public ResponseEntity<TaskData> create(@RequestBody @Valid TaskRequestPayload p) { return ResponseEntity.status(201).body(service.create(p)); }
- @GetMapping public List<TaskData> list() { return service.listAll(); }
- @GetMapping("/{id}") public TaskData get(@PathVariable UUID id) { return service.get(id); }
- @PatchMapping("/{id}") public TaskData update(@PathVariable UUID id, @RequestBody @Valid TaskRequestPayload p) { return service.update(id, p); }
- @PatchMapping("/{id}/move") public TaskData move(@PathVariable UUID id, @RequestParam TaskStatus status, @RequestParam Long position) { return service.move(id, status, position); }
- @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }

Arquivo 9) backend/src/main/resources/db/migration/V1__create_tasks.sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL,
  priority VARCHAR(10) NOT NULL,
  position BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tasks_status_position ON tasks(status, position);

VERIFICAÇÃO FINAL:
cd backend && ./mvnw -q -DskipTests package
Se PASSAR, termine sua resposta com a linha EXATA:
BACKEND_TASKS_CRUD=OK
Se FALHAR, mostre a stack trace relevante e termine com:
BACKEND_TASKS_CRUD=FAIL

Não pergunte nada. Faça em uma única passada.