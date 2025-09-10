package com.research.assistant;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;

    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Assignment>> getAssignmentsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByStatus(status));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Assignment>> getUpcomingAssignments() {
        return ResponseEntity.ok(assignmentService.getUpcomingAssignments());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Assignment>> getOverdueAssignments() {
        return ResponseEntity.ok(assignmentService.getOverdueAssignments());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Assignment>> searchAssignments(@RequestParam String q) {
        return ResponseEntity.ok(assignmentService.searchAssignments(q));
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getAssignmentStatistics() {
        return ResponseEntity.ok(assignmentService.getAssignmentStatistics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable String id) {
        Assignment assignment = assignmentService.getAssignmentById(id);
        if (assignment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(assignment);
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody AssignmentRequest request) {
        Assignment assignment = assignmentService.createAssignment(request);
        return ResponseEntity.ok(assignment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable String id, @RequestBody AssignmentRequest request) {
        Assignment assignment = assignmentService.updateAssignment(id, request);
        if (assignment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(assignment);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Assignment> updateAssignmentStatus(@PathVariable String id, @RequestBody Map<String, String> statusRequest) {
        String status = statusRequest.get("status");
        Assignment assignment = assignmentService.updateAssignmentStatus(id, status);
        if (assignment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(assignment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable String id) {
        boolean deleted = assignmentService.deleteAssignment(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
