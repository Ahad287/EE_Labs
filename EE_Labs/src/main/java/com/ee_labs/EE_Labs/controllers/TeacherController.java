package com.ee_labs.EE_Labs.controllers;

import com.ee_labs.EE_Labs.models.Quiz;
import com.ee_labs.EE_Labs.models.User;
import com.ee_labs.EE_Labs.repository.ExperimentRepository;
import com.ee_labs.EE_Labs.repository.QuizRepository;
import com.ee_labs.EE_Labs.repository.QuizResultRepository;
import com.ee_labs.EE_Labs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.ee_labs.EE_Labs.models.Experiment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository;
    private final ExperimentRepository experimentRepository; // <--- ADD THIS

    @Value("${gemini.api.key}")
    private String geminiApiKey;
    // Helper to verify the user is actually a teacher
    // Allows both Teachers AND Admins
    private boolean isTeacherOrAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        return user != null && ("teacher".equals(user.getRole()) || "admin".equals(user.getRole()));
    }

    // STRICTLY for the Super Admin
    private boolean isAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        return user != null && "admin".equals(user.getRole());
    }

    // --- 1. VIEW STUDENTS ---
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");

        // Fetch everyone with the role 'student'
        List<User> students = userRepository.findByRole("student");
        // Remove password hashes before sending to frontend for security!
        students.forEach(s -> s.setPasswordHash(null));

        return ResponseEntity.ok(students);
    }

    // --- 2. REMOVE STUDENT ---
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> removeStudent(@PathVariable Integer id) {
        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");

        userRepository.deleteById(id);
        return ResponseEntity.ok().body(Map.of("message", "Student removed successfully"));
    }

    // --- 3. AI QUIZ GENERATOR (Foundation) ---
    @PostMapping("/generate-quiz/{semesterId}")
    public ResponseEntity<?> generateAiQuiz(@PathVariable Integer semesterId, @RequestParam(defaultValue = "5") int count ){

        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");

        List<Experiment> semesterExps = experimentRepository.findBySemesterOrderByTitleAsc(semesterId);

        if (semesterExps.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No experiments found for Semester " + semesterId));
        }

        StringBuilder topics = new StringBuilder();
        for (Experiment exp : semesterExps) {
            topics.append(exp.getTitle()).append(", ");
        }

        // 2. Inject the dynamic 'count' variable into the prompt!
        String prompt = "You are an Electrical Engineering professor. Create a " + count + "-question multiple-choice quiz based on these laboratory topics: "
                + topics.toString() + ". "
                + "Respond STRICTLY with ONLY a raw JSON object. Do not use markdown syntax. "
                + "The JSON must perfectly match this structure: "
                + "{\"title\": \"Semester " + semesterId + " AI Assessment\", \"questions\": [{\"question\": \"...\", \"options\": [\"...\", \"...\", \"...\", \"...\"], \"answer\": \"...\"}]}";

        try {
            // 1. Aggressively clean the API key (removes quotes, spaces, and invisible line breaks)
            String cleanKey = geminiApiKey.replaceAll("[\"'\\s\\r\\n]", "");

            // 2. Build the exact URL string
// 2. Build the URL in safe, unbreakable pieces
            String apiHost = "https://generativelanguage.googleapis.com";
            String apiPath = "/v1beta/models/gemini-2.5-flash:generateContent?key=";
            String urlString = apiHost + apiPath + cleanKey;
            // 3. Force it into a strict Java URI object
            java.net.URI uri = new java.net.URI(urlString);

            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            // 4. Use the URI object instead of the raw string
            ResponseEntity<String> response = restTemplate.postForEntity(uri, requestBody, String.class);


            // 5. Parse the Response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());
            String aiJsonText = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            // --- BULLETPROOF JSON EXTRACTOR ---
            // Finds the first '{' and the last '}' to strip away any conversational text Gemini added
            int startIndex = aiJsonText.indexOf('{');
            int endIndex = aiJsonText.lastIndexOf('}');

            if (startIndex != -1 && endIndex != -1) {
                aiJsonText = aiJsonText.substring(startIndex, endIndex + 1);
            }

            // Convert string to a standard Java Map to guarantee perfect Spring Boot serialization
            java.util.Map<String, Object> finalQuizMap = mapper.readValue(aiJsonText, java.util.Map.class);
            return ResponseEntity.ok(finalQuizMap);
        } catch (Exception e) {
            e.printStackTrace(); // This will print the exact failure reason to your console
            return ResponseEntity.status(500).body(Map.of("error", "AI Generation Failed: " + e.getMessage()));
        }
    }

    // --- 4. MANAGE EXPERIMENTS ---
    @PostMapping("/experiments")
    public ResponseEntity<?> addExperiment(@RequestBody Experiment experiment) {
        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");
        return ResponseEntity.ok(experimentRepository.save(experiment));
    }

    // --- FETCH ALL EXPERIMENTS FOR TEACHER ---
    @GetMapping("/experiments")
    public ResponseEntity<?> getAllExperiments() {
        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");

        // Fetch all experiments and sort them by semester and title
        List<Experiment> allExps = experimentRepository.findAll();
        return ResponseEntity.ok(allExps);
    }

    @PutMapping("/experiments/{id}")
    public ResponseEntity<?> updateExperiment(@PathVariable Integer id, @RequestBody Experiment expDetails) {
        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");

        Experiment exp = experimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experiment not found"));

        // Update ALL core fields
        exp.setTitle(expDetails.getTitle());
        exp.setSemester(expDetails.getSemester());
        exp.setSummary(expDetails.getSummary());
        exp.setSimulatorUrl(expDetails.getSimulatorUrl());

        // Update the new rich content fields
        exp.setDescription(expDetails.getDescription());
        exp.setLearningObjectives(expDetails.getLearningObjectives());
        exp.setProcedure(expDetails.getProcedure());
        exp.setImageUrl(expDetails.getImageUrl());
        exp.setDifficulty(expDetails.getDifficulty());
        exp.setDuration(expDetails.getDuration());
        exp.setRequiredMaterials(expDetails.getRequiredMaterials());
        exp.setSafetyPrecautions(expDetails.getSafetyPrecautions());
        exp.setTeamSize(expDetails.getTeamSize());

        return ResponseEntity.ok(experimentRepository.save(exp));
    }

    @DeleteMapping("/experiments/{id}")
    public ResponseEntity<?> deleteExperiment(@PathVariable Integer id) {
        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");
        experimentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Experiment deleted successfully"));
    }

    // --- 5. PROFILE SETTINGS ---
    // --- 5. PROFILE SETTINGS ---
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("name")) {
            currentUser.setName(updates.get("name"));
        }
        if (updates.containsKey("password") && !updates.get("password").isEmpty()) {
            // Note: In production, wrap this in a PasswordEncoder!
            currentUser.setPasswordHash(updates.get("password"));
        }

        userRepository.save(currentUser);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    // --- 6. LIVE QUIZ SCORES ---
    @GetMapping("/quiz-results")
    public ResponseEntity<?> getQuizResults() {
        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");

        // Fetch all real student scores directly from the new PostgreSQL table!
        // Sorting them by date so the newest quizzes appear at the top.
        List<com.ee_labs.EE_Labs.models.QuizResult> liveResults = quizResultRepository.findAll(
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "date")
        );

        return ResponseEntity.ok(liveResults);
    }

    @PostMapping("/publish-quiz")
    public ResponseEntity<?> publishScheduledQuiz(@RequestBody Quiz quiz) {
        if (!isTeacherOrAdmin()) return ResponseEntity.status(403).body("Access denied.");
        return ResponseEntity.ok(quizRepository.save(quiz));
    }

    // --- 7. ADMIN: GET PENDING TEACHERS ---
    @GetMapping("/pending-teachers")
    public ResponseEntity<?> getPendingTeachers() {
        if (!isAdmin()) return ResponseEntity.status(403).body("Access denied.");

        // Find all teachers where isApproved is false
        List<User> pending = userRepository.findByRoleAndIsApproved("teacher", false);
        pending.forEach(u -> u.setPasswordHash(null)); // Hide passwords
        return ResponseEntity.ok(pending);
    }

    // --- 8. ADMIN: APPROVE TEACHER ---
    @PutMapping("/approve-teacher/{id}")
    public ResponseEntity<?> approveTeacher(@PathVariable Integer id) {
        if (!isAdmin()) return ResponseEntity.status(403).body("Access denied.");

        User teacher = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        teacher.setIsApproved(true);
        userRepository.save(teacher);

        return ResponseEntity.ok(Map.of("message", "Teacher approved successfully"));
    }
}