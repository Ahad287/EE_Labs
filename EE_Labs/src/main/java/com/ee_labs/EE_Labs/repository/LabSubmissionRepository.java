package com.ee_labs.EE_Labs.repository;

import com.ee_labs.EE_Labs.models.LabSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabSubmissionRepository extends JpaRepository<LabSubmission, Integer> {
    // Allows teachers to pull all submissions for a specific experiment
    List<LabSubmission> findByExperimentId(Integer experimentId);

    // Allows a student to see their own past submissions
    List<LabSubmission> findByUserId(Integer userId);

    List<LabSubmission> findByUserIdOrderBySubmittedAtDesc(Integer userId);
}