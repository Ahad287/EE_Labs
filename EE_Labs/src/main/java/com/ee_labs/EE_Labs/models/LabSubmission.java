package com.ee_labs.EE_Labs.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "lab_submissions")
public class LabSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "experiment_id", nullable = false)
    private Integer experimentId;

    // This magically maps your dynamic React rows into a PostgreSQL JSONB column!
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "observation_data", columnDefinition = "jsonb")
    private Object observationData;

    @Column(name = "falstad_circuit_data", columnDefinition = "text")
    private String falstadCircuitData;

    @Column(name = "submitted_at", insertable = false, updatable = false)
    private Timestamp submittedAt;
}