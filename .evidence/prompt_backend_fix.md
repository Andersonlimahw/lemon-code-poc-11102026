CONTEXTO: você está em /Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026. Backend Spring Boot em ./backend, JPA + Flyway. Acabei de notar dois problemas na sua entrega anterior que precisam de correção cirúrgica:

PROBLEMA 1 — PATCH /api/tasks/{id}/move retorna 400 quando passo ?status=in_progress&position=3 porque o Jackson está usando o @JsonValue lowercase do enum para desserializar @RequestParam também, e os params da URL são case-sensitive.

PROBLEMA 2 — GET /api/tasks/{id-de-uuid-que-nao-existe} retorna 500 em vez de 404, porque não há @ControllerAdvice / @ExceptionHandler para jakarta.persistence.EntityNotFoundException.

CORREÇÕES EXATAS (apenas estas, nada mais):

A) backend/src/main/java/com/lemon/planner/task/TaskController.java
Localize o método:
  @PatchMapping("/{id}/move") public TaskData move(@PathVariable UUID id, @RequestParam TaskStatus status, @RequestParam Long position) { return service.move(id, status, position); }

Substitua por:
  @PatchMapping("/{id}/move") public TaskData move(@PathVariable UUID id, @RequestParam("status") String statusRaw, @RequestParam("position") Long position) {
    TaskStatus s;
    try { s = TaskStatus.valueOf(statusRaw.trim().toUpperCase()); }
    catch (IllegalArgumentException e) { throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "status inválido: " + statusRaw); }
    return service.move(id, s, position);
  }

B) Crie backend/src/main/java/com/lemon/planner/task/TaskExceptionHandler.java:
  @ControllerAdvice
  public class TaskExceptionHandler {
    @ExceptionHandler(jakarta.persistence.EntityNotFoundException.class)
    public org.springframework.http.ResponseEntity<java.util.Map<String,Object>> notFound(jakarta.persistence.EntityNotFoundException ex) {
      return org.springframework.http.ResponseEntity.status(404).body(java.util.Map.of("status", 404, "error", "Not Found", "message", ex.getMessage() == null ? "recurso não encontrado" : ex.getMessage()));
    }
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public org.springframework.http.ResponseEntity<java.util.Map<String,Object>> validation(org.springframework.web.bind.MethodArgumentNotValidException ex) {
      return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("status", 400, "error", "Bad Request", "message", ex.getBindingResult().getAllErrors().toString()));
    }
  }

C) NÃO altere mais nada. NÃO toque em pom.xml. NÃO toque nos outros arquivos. NÃO regenere migrations. NÃO mexa em frontend.

D) No final, rode:
  cd backend && ./mvnw -q -DskipTests package

Se PASSOU sem erro de compilação, termine sua resposta com a linha EXATA:
BACKEND_FIX=OK
Se falhou, mostre a stack trace curta relevante e termine com:
BACKEND_FIX=FAIL

Faça em uma única passada, sem perguntas.