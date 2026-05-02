package com.ee_labs.EE_Labs.controllers;

import com.ee_labs.EE_Labs.models.Experiment;
import com.ee_labs.EE_Labs.repository.ExperimentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/experiments")
//@CrossOrigin(origins = "http://loalhost:3000")
@RequiredArgsConstructor
public class ExperimentController {
    private final ExperimentRepository repository;
    @GetMapping("/semester/{semId}")
    public ResponseEntity<List<Experiment>> getExperimentsBySemester(@PathVariable Integer semId) {
        List<Experiment> experiments = repository.findBySemesterOrderByTitleAsc(semId);
        return ResponseEntity.ok(experiments);
    }

    @GetMapping("/{id}")
        public ResponseEntity<Experiment> getExperimentById(@PathVariable Integer id){
            return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());

    }
}
