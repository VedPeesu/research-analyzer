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
}