package com.ee_labs.EE_Labs.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "quizzes")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private Integer semester;
    private LocalDateTime startTime; // E.g., 2026-04-24T14:30:00
    private Integer durationMinutes; // E.g., 10

    @JdbcTypeCode(SqlTypes.JSON)
    private String questions; // Stores the JSON array of questions/options
}