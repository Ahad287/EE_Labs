package com.ee_labs.EE_Labs.models;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private String role; // 'student' or 'teacher'
    private Integer semester;

    private LocalDate lastSemesterUpdate;

    private Boolean isApproved = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;
}