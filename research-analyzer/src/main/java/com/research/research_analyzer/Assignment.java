package com.research.assistant;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Assignment {
    private String id;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private String priority;
    private String status;
    private String category;
    private String course;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
