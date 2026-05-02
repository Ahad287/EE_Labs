package com.ee_labs.EE_Labs.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // A secure, hardcoded key for development (In production, put this in application.properties)
    private static final String SECRET = "EELabsSuperSecretKeyForBitMesraStudents2026!";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // 14 Days in milliseconds
    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 15;

    public String generateToken(String email, String role, String name) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("name", name)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}