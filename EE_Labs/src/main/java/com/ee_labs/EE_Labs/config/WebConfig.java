package com.ee_labs.EE_Labs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Applies this rule to ALL your API endpoints
                .allowedOrigins("http://localhost:3000") // The exact address of your React app
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allows all standard web requests
                .allowedHeaders("*") // Allows all data headers
                .allowCredentials(true); // Required for future Login/Security tokens
    }
}