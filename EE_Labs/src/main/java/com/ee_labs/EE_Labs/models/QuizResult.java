package com.ee_labs.EE_Labs.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "quiz_results")
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer userId;
    private String studentName;
    private Integer semester;
    private Integer quizId;
    private String quizTitle;
    private Integer score;
    private Integer total;
    private LocalDate date;
    private LocalDateTime quizEndTime;
}