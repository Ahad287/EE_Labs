package com.ee_labs.EE_Labs.controllers;

import com.ee_labs.EE_Labs.models.LabSubmission;
import com.ee_labs.EE_Labs.models.Quiz;
import com.ee_labs.EE_Labs.models.QuizResult;
import com.ee_labs.EE_Labs.models.User;
import com.ee_labs.EE_Labs.repository.LabSubmissionRepository; // Update import if your name differs
import com.ee_labs.EE_Labs.repository.QuizRepository;
import com.ee_labs.EE_Labs.repository.QuizResultRepository;
import com.ee_labs.EE_Labs.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final UserRepository userRepository;
    private final LabSubmissionRepository submissionRepository;
    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository; // <-- ADD THIS

    // Helper to get the currently logged-in student
    private User getAuthenticatedStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // --- 1. GET PAST OBSERVATIONS ---
    @GetMapping("/submissions")
    public ResponseEntity<?> getMySubmissions() {
        User student = getAuthenticatedStudent();
        List<LabSubmission> mySubmissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(student.getUserId());
        return ResponseEntity.ok(mySubmissions);
    }

    // --- 2. UPDATE PROFILE (Name, Password, Semester) ---
    // --- 2. SECURE PROFILE UPDATE ---
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates) {
        User student = getAuthenticatedStudent();

        if (updates.containsKey("name")) {
            student.setName((String) updates.get("name"));
        }
        if (updates.containsKey("password") && !((String) updates.get("password")).isEmpty()) {
            student.setPasswordHash((String) updates.get("password"));
        }

        // --- 60-DAY SEMESTER LOCK LOGIC ---
        if (updates.containsKey("semester")) {
            int newSemester = Integer.parseInt(updates.get("semester").toString());

            // Only check the restriction if they are ACTUALLY changing the number
            if (student.getSemester() != null && student.getSemester() != newSemester) {
                if (student.getLastSemesterUpdate() != null) {
                    long daysSinceUpdate = java.time.temporal.ChronoUnit.DAYS.between(student.getLastSemesterUpdate(), java.time.LocalDate.now());

                    if (daysSinceUpdate < 60) {
                        return ResponseEntity.status(403).body(Map.of("error",
                                "You can only change your semester once every 60 days. You have " + (60 - daysSinceUpdate) + " days remaining."));
                    }
                }
                student.setSemester(newSemester);
                student.setLastSemesterUpdate(java.time.LocalDate.now()); // Reset the clock!
            }
        }

        userRepository.save(student);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    // --- 3. DELETE ACCOUNT ---
    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount() {
        User student = getAuthenticatedStudent();

        // Note: Because of foreign keys, deleting a user might fail if they have submissions.
        // In a real DB, you'd set ON DELETE CASCADE on the submissions table, or manually delete them here first:
        // submissionRepository.deleteAll(submissionRepository.findByUserIdOrderBySubmittedAtDesc(student.getUserId()));

        userRepository.delete(student);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

    @GetMapping("/active-quizzes")
    public ResponseEntity<?> getMyQuizzes() {
        User student = getAuthenticatedStudent();
        // The database automatically filters out quizzes meant for other semesters!
        List<Quiz> myQuizzes = quizRepository.findBySemesterOrderByStartTimeDesc(student.getSemester());
        return ResponseEntity.ok(myQuizzes);
    }

    // --- 5. THE AUTO-GRADER ---
    // --- 5. THE SECURE AUTO-GRADER ---
    @PostMapping("/submit-quiz/{quizId}")
    public ResponseEntity<?> submitQuiz(@PathVariable Integer quizId, @RequestBody Map<String, String> studentAnswers) {
        User student = getAuthenticatedStudent();

        // RULE 2: Block multiple submissions rigidly at the database level
        if (quizResultRepository.existsByUserIdAndQuizId(student.getUserId(), quizId)) {
            return ResponseEntity.status(400).body(Map.of("error", "You have already submitted this quiz."));
        }

        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new RuntimeException("Quiz not found"));

        ObjectMapper mapper = new ObjectMapper();
        int score = 0;
        int total = 0;

        try {
            JsonNode questionsNode = mapper.readTree(quiz.getQuestions());
            for (int i = 0; i < questionsNode.size(); i++) {
                total++;
                String correctAns = questionsNode.get(i).get("answer").asText();
                String studentAns = studentAnswers.get(String.valueOf(i));

                if (correctAns != null && correctAns.equals(studentAns)) {
                    score++;
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error grading quiz"));
        }

        QuizResult result = new QuizResult();
        result.setUserId(student.getUserId());
        result.setStudentName(student.getName());
        result.setSemester(student.getSemester());
        result.setQuizId(quizId);
        result.setQuizTitle(quiz.getTitle());
        result.setScore(score);
        result.setTotal(total);
        result.setDate(java.time.LocalDate.now());

        // RULE 1: Save the exact time the quiz closes so the frontend knows when to reveal the score
        result.setQuizEndTime(quiz.getStartTime().plusMinutes(quiz.getDurationMinutes()));

        quizResultRepository.save(result);

        // We no longer return the score directly to prevent immediate popups!
        return ResponseEntity.ok(Map.of("message", "Quiz successfully submitted."));
    }

    // --- 6. GET MY SCORES ---
    @GetMapping("/my-scores")
    public ResponseEntity<?> getMyScores() {
        User student = getAuthenticatedStudent();
        return ResponseEntity.ok(quizResultRepository.findByUserIdOrderByDateDesc(student.getUserId()));
    }
}