package com.research.assistant;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class AssignmentService {
    private final Map<String, Assignment> assignments = new ConcurrentHashMap<>();
    private int assignmentIdCounter = 1;

    public List<Assignment> getAllAssignments() {
        return new ArrayList<>(assignments.values());
    }

    public List<Assignment> getAssignmentsByStatus(String status) {
        return assignments.values().stream()
                .filter(assignment -> assignment.getStatus().equals(status))
                .collect(Collectors.toList());
    }
    public List<Assignment> getUpcomingAssignments() {
        LocalDateTime now = LocalDateTime.now();
        return assignments.values().stream()
                .filter(assignment -> assignment.getDeadline().isAfter(now) && 
                               !assignment.getStatus().equals("completed"))
                .sorted(Comparator.comparing(Assignment::getDeadline))
                .collect(Collectors.toList());
    }

    public List<Assignment> getOverdueAssignments() {
        LocalDateTime now = LocalDateTime.now();
        return assignments.values().stream()
                .filter(assignment -> assignment.getDeadline().isBefore(now) && 
                               !assignment.getStatus().equals("completed"))
                .sorted(Comparator.comparing(Assignment::getDeadline))
                .collect(Collectors.toList());
    }

    public Assignment createAssignment(AssignmentRequest request) {
        String id = "assignment-" + assignmentIdCounter++;
        LocalDateTime now = LocalDateTime.now();
        
        Assignment assignment = new Assignment();
        assignment.setId(id);
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDeadline(request.getDeadline());
        assignment.setPriority(request.getPriority() != null ? request.getPriority() : "medium");
        assignment.setStatus("not_started");
        assignment.setCategory(request.getCategory() != null ? request.getCategory() : "general");
        assignment.setCourse(request.getCourse());
        assignment.setCreatedAt(now);
        assignment.setUpdatedAt(now);

        assignments.put(id, assignment);
        return assignment;
    }

    public Assignment updateAssignment(String id, AssignmentRequest request) {
        Assignment assignment = assignments.get(id);
        if (assignment == null) {
            return null;
        }

        if (request.getTitle() != null) assignment.setTitle(request.getTitle());
        if (request.getDescription() != null) assignment.setDescription(request.getDescription());
        if (request.getDeadline() != null) assignment.setDeadline(request.getDeadline());
        if (request.getPriority() != null) assignment.setPriority(request.getPriority());
        if (request.getCategory() != null) assignment.setCategory(request.getCategory());
        if (request.getCourse() != null) assignment.setCourse(request.getCourse());
        
        assignment.setUpdatedAt(LocalDateTime.now());
        return assignment;
    }

    public Assignment updateAssignmentStatus(String id, String status) {
        Assignment assignment = assignments.get(id);
        if (assignment == null) {
            return null;
        }

        assignment.setStatus(status);
        assignment.setUpdatedAt(LocalDateTime.now());
        return assignment;
    }

    public boolean deleteAssignment(String id) {
        return assignments.remove(id) != null;
    }

    public Assignment getAssignmentById(String id) {
        return assignments.get(id);
    }
}