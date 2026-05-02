package com.ee_labs.EE_Labs.repository;

import com.ee_labs.EE_Labs.models.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Integer> {
    List<QuizResult> findByUserIdOrderByDateDesc(Integer userId);

    boolean existsByUserIdAndQuizId(Integer userId, Integer quizId);
}