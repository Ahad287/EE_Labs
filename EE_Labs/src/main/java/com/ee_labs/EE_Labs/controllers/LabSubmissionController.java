package com.ee_labs.EE_Labs.controllers;

import com.ee_labs.EE_Labs.models.LabSubmission;
import com.ee_labs.EE_Labs.models.SubmissionDTO;
import com.ee_labs.EE_Labs.models.User;
import com.ee_labs.EE_Labs.repository.LabSubmissionRepository;
import com.ee_labs.EE_Labs.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.ByteArrayOutputStream;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class LabSubmissionController {

    private final LabSubmissionRepository submissionRepository;
    private final UserRepository userRepository; // Inject UserRepository

    @PostMapping("/save")
    public ResponseEntity<?> saveSubmission(@RequestBody LabSubmission submission) {
        // 1. Get the email securely from the JWT token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Find the actual user in the database
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Force the submission to belong to the logged-in user (prevents hacking)
        submission.setUserId(currentUser.getUserId());

        // 4. Save to database
        LabSubmission saved = submissionRepository.save(submission);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<List<LabSubmission>> getStudentSubmissions(@PathVariable Integer userId) {
        return ResponseEntity.ok(submissionRepository.findByUserId(userId));
    }

    @GetMapping("/teacher/all")
    public ResponseEntity<?> getAllSubmissionsForTeacher() {
        // 1. Get the email from the JWT Token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Security Check: Block students from viewing all submissions!
        if (!"teacher".equals(currentUser.getRole()) && !"admin".equals(currentUser.getRole())) {
            return ResponseEntity.status(403).body("Error: Access denied. Teachers only.");
        }

        // 3. Fetch all submissions and map them to our new DTO
        List<LabSubmission> allSubmissions = submissionRepository.findAll();

        List<SubmissionDTO> dtos = allSubmissions.stream().map(sub -> {
            User student = userRepository.findById(sub.getUserId()).orElse(new User());
            return new SubmissionDTO(sub, student);
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/teacher/export")
    public ResponseEntity<byte[]> exportSubmissionsToExcel() throws Exception {
        // 1. Security Check
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"teacher".equals(currentUser.getRole()) && !"admin".equals(currentUser.getRole())) {
            return ResponseEntity.status(403).body(null);
        }

        List<LabSubmission> allSubmissions = submissionRepository.findAll();

        // 2. Create Workbook and Sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Lab Reports");

        // 3. Setup Beautiful Excel Styles
        CellStyle headerStyle = workbook.createCellStyle();
        Font boldFont = workbook.createFont();
        boldFont.setBold(true);
        headerStyle.setFont(boldFont);

        CellStyle highlightStyle = workbook.createCellStyle();
        highlightStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
        highlightStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        highlightStyle.setFont(boldFont);

        ObjectMapper mapper = new ObjectMapper();
        int rowIdx = 0;

        // 4. Build the Report Dynamically
        for (LabSubmission sub : allSubmissions) {
            User student = userRepository.findById(sub.getUserId()).orElse(new User());

            // Create a highlighted row for the Student's Info
            Row studentInfoRow = sheet.createRow(rowIdx++);
            studentInfoRow.createCell(0).setCellValue("Student: " + student.getName());
            studentInfoRow.createCell(1).setCellValue("Email: " + student.getEmail());
            studentInfoRow.createCell(2).setCellValue("Experiment ID: " + sub.getExperimentId());
            studentInfoRow.createCell(3).setCellValue("Date: " + (sub.getSubmittedAt() != null ? sub.getSubmittedAt().toString() : ""));

            // Apply the blue highlight to the student info row
            for(int i = 0; i <= 3; i++) {
                studentInfoRow.getCell(i).setCellStyle(highlightStyle);
            }

            // Parse the JSON Observation Data into a real Excel Table!
            try {
                String jsonString = mapper.writeValueAsString(sub.getObservationData());
                JsonNode root = mapper.readTree(jsonString);
                JsonNode columnsNode = root.get("columns");
                JsonNode dataNode = root.get("data");

                if (columnsNode != null && columnsNode.isArray()) {
                    // Create the Table Header Row (Indented by 1 column for neatness)
                    Row tableHeader = sheet.createRow(rowIdx++);
                    for (int i = 0; i < columnsNode.size(); i++) {
                        Cell cell = tableHeader.createCell(i + 1);
                        String colName = columnsNode.get(i).get("name").asText();
                        boolean isCalc = columnsNode.get(i).has("isCalculated") && columnsNode.get(i).get("isCalculated").asBoolean();
                        cell.setCellValue(colName + (isCalc ? " (ƒ)" : ""));
                        cell.setCellStyle(headerStyle);
                    }

                    // Fill in the Student's actual readings
                    if (dataNode != null && dataNode.isArray()) {
                        for (JsonNode rowNode : dataNode) {
                            Row dataRow = sheet.createRow(rowIdx++);
                            for (int i = 0; i < columnsNode.size(); i++) {
                                String colName = columnsNode.get(i).get("name").asText();
                                Cell cell = dataRow.createCell(i + 1);

                                if (rowNode.has(colName) && !rowNode.get(colName).isNull()) {
                                    JsonNode val = rowNode.get(colName);
                                    // Handle numbers vs text cleanly
                                    if(val.isNumber()) {
                                        cell.setCellValue(val.asDouble());
                                    } else {
                                        cell.setCellValue(val.asText());
                                    }
                                } else {
                                    cell.setCellValue("-");
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                Row errorRow = sheet.createRow(rowIdx++);
                errorRow.createCell(1).setCellValue("No readable table data found.");
            }

            // Add a blank spacer row before the next student
            rowIdx++;
        }

        // Auto-size columns to fit the data perfectly
        for(int i = 0; i < 10; i++) {
            sheet.autoSizeColumn(i);
        }

        // 5. Convert to Binary Stream
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "EE_Lab_Submissions.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(out.toByteArray());
    }
}