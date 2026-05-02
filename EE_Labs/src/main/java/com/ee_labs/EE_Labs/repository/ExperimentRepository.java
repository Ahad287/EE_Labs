package com.ee_labs.EE_Labs.repository;

import com.ee_labs.EE_Labs.models.Experiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface ExperimentRepository extends JpaRepository<Experiment,Integer> {
    List<Experiment> findBySemesterOrderByTitleAsc(Integer semester);
}
