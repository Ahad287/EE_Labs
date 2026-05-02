package com.ee_labs.EE_Labs.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.*;

@Data
@Entity
@Table(name = "experiments")
public class Experiment{
    @Id
    private Integer id;

    private Integer semester;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration;

    @Column(name = "team_size")
    private Integer teamSize;

    private String difficulty;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @JsonProperty("learningObjectives")
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "learning_Objectives",columnDefinition = "text[]")
    private List<String> LearningObjectives;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "safety_precautions",columnDefinition = "text[]")
    private List<String> safetyPrecautions;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "procedure_steps",columnDefinition = "text[]")
    private List<String> procedure;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "observation_columns",columnDefinition = "text[]")
    private List<String> observationColumns;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "required_materials",columnDefinition = "jsonb")
    private List<Map<String,Object>> requiredMaterials;

    @Column(name = "simulator_url",length=500)
    private String simulatorUrl;
}
