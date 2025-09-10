package com.research.assistant;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AssignmentRequest {
    private String title;
    private String description;
    private LocalDateTime deadline;
    private String priority;
    private String category;
    private String course;
}
