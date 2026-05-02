package com.ee_labs.EE_Labs.models;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class SubmissionDTO {
    private Integer submissionId;
    private String studentName;
    private String studentEmail;
    private Integer semester;
    private Integer experimentId;
    private Object observationData;
    private Timestamp submittedAt;

    // Custom constructor to map the database entities into this clean package
    public SubmissionDTO(LabSubmission sub, User user) {
        this.submissionId = sub.getId();
        this.studentName = user.getName();
        this.studentEmail = user.getEmail();
        this.semester = user.getSemester();
        this.experimentId = sub.getExperimentId();
        this.observationData = sub.getObservationData();
        this.submittedAt = sub.getSubmittedAt();
    }
}