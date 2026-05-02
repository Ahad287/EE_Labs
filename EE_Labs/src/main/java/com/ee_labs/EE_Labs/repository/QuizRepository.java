package com.ee_labs.EE_Labs.repository;

import com.ee_labs.EE_Labs.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    // Finds quizzes specifically targeted to the student's semester
    List<Quiz> findBySemesterOrderByStartTimeDesc(Integer semester);
}