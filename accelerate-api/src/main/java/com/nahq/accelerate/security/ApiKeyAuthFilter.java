package com.nahq.accelerate.security;

import jakarta.persistence.EntityManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ApiKeyAuthFilter.class);

    @Value("${app.admin-api-key:nahq-sandbox-2026}")
    private String adminApiKey;

    private final EntityManager em;

    public ApiKeyAuthFilter(EntityManager em) {
        this.em = em;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {

        // Mode 1: Admin API key
        String apiKey = request.getHeader("X-Api-Key");
        if (adminApiKey.equals(apiKey)) {
            var authorities = List.of(
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("ROLE_EXECUTIVE"),
                new SimpleGrantedAuthority("ROLE_PARTICIPANT")
            );
            var auth = new UsernamePasswordAuthenticationToken("admin", null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
            filterChain.doFilter(request, response);
            return;
        }

        // Mode 2: User impersonation via X-User-Id header
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null) {
            try {
                Long userId = Long.parseLong(userIdHeader);

                // Single eager query — no lazy loading issues
                @SuppressWarnings("unchecked")
                List<Object[]> rows = em.createNativeQuery(
                    "SELECT u.email, rt.internal_id " +
                    "FROM app_user u " +
                    "JOIN user_role ur ON u.id = ur.user_id AND ur.thru_date IS NULL " +
                    "JOIN role_type rt ON ur.role_type_id = rt.id " +
                    "WHERE u.id = :userId"
                ).setParameter("userId", userId).getResultList();

                if (!rows.isEmpty()) {
                    String email = (String) rows.get(0)[0];
                    List<SimpleGrantedAuthority> authorities = rows.stream()
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + ((String) r[1]).toUpperCase()))
                        .collect(Collectors.toList());

                    var auth = new UsernamePasswordAuthenticationToken(email, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.debug("Impersonating user {} with roles: {}", email, authorities);
                }
            } catch (Exception e) {
                log.debug("User impersonation failed for userId={}: {}", userIdHeader, e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
