package com.ee_labs.EE_Labs.controllers;

import com.ee_labs.EE_Labs.models.User;
import com.ee_labs.EE_Labs.repository.UserRepository;
import com.ee_labs.EE_Labs.security.JwtUtil;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    // --- HELPER METHODS ---
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password");
        }
    }

    private String generateOTP() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    // ==========================================
    // 1. GOOGLE SSO LOGIN / REGISTER
    // ==========================================
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.get("idToken"));
            String email = decodedToken.getEmail();

            // Allow bypassing domain check ONLY for the hardcoded admin
            if (!email.endsWith("@bitmesra.ac.in") && !email.equalsIgnoreCase("admin@bitmesra.ac.in")) {
                return ResponseEntity.status(403).body(Map.of("error", "Only @bitmesra.ac.in emails are allowed."));
            }

            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getIsApproved() != null && !user.getIsApproved()) {
                    return ResponseEntity.status(403).body(Map.of("error", "Your teacher account is pending Admin approval."));
                }
                String jwt = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());
                return ResponseEntity.ok(Map.of("token", jwt, "user", user));
            } else {
                return ResponseEntity.status(202).body(Map.of("message", "requires_registration", "email", email, "name", decodedToken.getName()));
            }
        } catch (Exception e) {
            System.err.println("Google Auth Error: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid Google Token."));
        }
    }

    @PostMapping("/google/register")
    public ResponseEntity<?> completeGoogleRegistration(@RequestBody Map<String, String> request) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.get("idToken"));
            String email = decodedToken.getEmail();

            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User already exists."));
            }

            User newUser = new User();
            newUser.setName(decodedToken.getName());
            newUser.setEmail(email);
            // Must hash the dummy password to pass DB constraints!
            newUser.setPasswordHash(hashPassword("GOOGLE_SSO_" + UUID.randomUUID().toString()));
            newUser.setRole(request.get("role"));

            if ("student".equalsIgnoreCase(newUser.getRole())) {
                newUser.setSemester(Integer.parseInt(request.get("semester")));
                newUser.setIsApproved(true);
            } else if ("teacher".equalsIgnoreCase(newUser.getRole())) {
                newUser.setIsApproved(false);
            }

            if (email.equalsIgnoreCase("admin@bitmesra.ac.in")) {
                newUser.setRole("admin");
                newUser.setIsApproved(true);
            }

            userRepository.save(newUser);

            if (!newUser.getIsApproved()) {
                return ResponseEntity.ok(Map.of("message", "Registered successfully. Please wait for Admin approval."));
            }

            String jwt = jwtUtil.generateToken(newUser.getEmail(), newUser.getRole(), newUser.getName());
            return ResponseEntity.ok(Map.of("token", jwt, "user", newUser));

        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Registration failed."));
        }
    }

    // ==========================================
    // 2. STANDARD OTP & PASSWORD LOGIC
    // ==========================================
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (!email.endsWith("@bitmesra.ac.in") && !email.equalsIgnoreCase("admin@bitmesra.ac.in")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email must be a @bitmesra.ac.in address."));
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already registered."));
        }

        String otp = generateOTP();
        otpStorage.put(email, otp);
        System.out.println("\n--- DEV OTP FOR " + email + ": " + otp + " ---\n");

        try { sendEmail(email, "EE Labs: Verify Your Account", "Your OTP is: " + otp); }
        catch (Exception e) { System.out.println("Mail server error, check console for OTP."); }

        return ResponseEntity.ok(Map.of("message", "OTP generated! Check your email or backend console."));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String userOtp = request.get("otp");
        String role = request.get("role");

        if (!otpStorage.containsKey(email) || !otpStorage.get(email).equals(userOtp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP."));
        }
        if (password == null || password.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters long."));
        }

        User newUser = new User();
        newUser.setName(request.get("name"));
        newUser.setEmail(email);
        newUser.setRole(role);

        if ("student".equalsIgnoreCase(role) && request.containsKey("semester")) {
            newUser.setSemester(Integer.parseInt(request.get("semester")));
        }

        if (newUser.getEmail().equalsIgnoreCase("admin@bitmesra.ac.in")) {
            newUser.setRole("admin");
            newUser.setIsApproved(true);
        } else if ("student".equalsIgnoreCase(newUser.getRole())) {
            newUser.setIsApproved(true);
        } else if ("teacher".equalsIgnoreCase(newUser.getRole())) {
            newUser.setIsApproved(false);
        }

        newUser.setPasswordHash(hashPassword(password));
        userRepository.save(newUser);
        otpStorage.remove(email);

        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String rawPassword = loginRequest.get("password");

        if (email == null || rawPassword == null) return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String incomingHash = hashPassword(rawPassword);

            if (user.getPasswordHash().equals(incomingHash)) {
                boolean isApproved = user.getIsApproved() != null ? user.getIsApproved() : !"teacher".equalsIgnoreCase(user.getRole());
                if (!isApproved) return ResponseEntity.status(403).body(Map.of("error", "Your teacher account is pending Admin approval."));

                String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());
                return ResponseEntity.ok(Map.of("token", token, "user", user));
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password."));
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> forgotPasswordOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (userRepository.findByEmail(email).isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "No account found with that email."));

        String otp = generateOTP();
        otpStorage.put(email, otp);
        System.out.println("\n--- DEV PWD RESET OTP FOR " + email + ": " + otp + " ---\n");

        try { sendEmail(email, "EE Labs: Password Reset", "Your reset OTP is: " + otp); }
        catch (Exception e) { System.out.println("Mail server error, check console for OTP."); }

        return ResponseEntity.ok(Map.of("message", "OTP generated! Check your email or backend console."));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (!otpStorage.containsKey(email) || !otpStorage.get(email).equals(otp)) return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP."));
        if (newPassword == null || newPassword.length() < 8) return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters long."));

        User user = userRepository.findByEmail(email).get();
        user.setPasswordHash(hashPassword(newPassword));
        userRepository.save(user);
        otpStorage.remove(email);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now log in."));
    }
}