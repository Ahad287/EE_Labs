package com.ee_labs.EE_Labs.repository;

import com.ee_labs.EE_Labs.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // This allows us to search the database for an exact email match during login
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
    List<User> findByRoleAndIsApproved(String role, Boolean isApproved);
}