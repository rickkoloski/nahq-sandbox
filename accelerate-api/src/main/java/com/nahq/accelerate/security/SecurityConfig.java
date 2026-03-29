package com.nahq.accelerate.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final ApiKeyAuthFilter apiKeyAuthFilter;

    public SecurityConfig(ApiKeyAuthFilter apiKeyAuthFilter) {
        this.apiKeyAuthFilter = apiKeyAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger-ui.html").permitAll()
                // Login — public
                .requestMatchers("/api/auth/**").permitAll()
                // Seed endpoints — admin only
                .requestMatchers("/api/seed/**").hasRole("ADMIN")
                .requestMatchers("/api/courses/seed").hasRole("ADMIN")
                // Analytics refresh — admin only
                .requestMatchers("/api/analytics/refresh").hasRole("ADMIN")
                // AI generation — admin or executive
                .requestMatchers("/api/ai/org-insights/**").hasAnyRole("ADMIN", "EXECUTIVE")
                // All other API endpoints — authenticated
                .requestMatchers("/api/**").authenticated()
                // Error page and everything else
                .requestMatchers("/error").permitAll()
                .anyRequest().denyAll()
            )
            .addFilterBefore(apiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
