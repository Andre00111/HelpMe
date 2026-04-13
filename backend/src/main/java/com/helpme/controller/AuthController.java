package com.helpme.controller;

import com.helpme.dto.AuthResponse;
import com.helpme.dto.LoginRequest;
import com.helpme.dto.RegisterRequest;
import com.helpme.entity.User;
import com.helpme.security.JwtTokenProvider;
import com.helpme.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            log.info("📥 [AuthController] POST /auth/register - name: {}, email: {}, isHelper: {}",
                    request.getName(), request.getEmail(), request.getIsHelper());
            User user = userService.registerUser(request);
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
            AuthResponse response = AuthResponse.from(user, token);
            log.info("✅ [AuthController] Register successful - userId: {}, email: {}", user.getId(), user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("❌ [AuthController] Register failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("📥 [AuthController] POST /auth/login - email: {}", request.getEmail());
            User user = userService.loginUser(request);
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
            AuthResponse response = AuthResponse.from(user, token);
            log.info("✅ [AuthController] Login successful - userId: {}, email: {}", user.getId(), user.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("❌ [AuthController] Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("📥 [AuthController] GET /auth/me - Token validation");
            String token = authHeader.substring(7);
            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            User user = userService.getUserById(userId);
            log.info("✅ [AuthController] getCurrentUser successful - userId: {}, email: {}", user.getId(), user.getEmail());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("❌ [AuthController] getCurrentUser failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    @GetMapping("/profiles")
    public ResponseEntity<?> getProfiles() {
        try {
            log.info("📥 [AuthController] GET /auth/profiles - Fetching all profiles");
            var profiles = userService.getAllProfiles();
            log.info("✅ [AuthController] Profiles loaded - count: {}", profiles.size());
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            log.error("❌ [AuthController] Failed to load profiles: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Fehler beim Laden der Profile"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new HealthResponse("API ist erreichbar"));
    }

    public static class ErrorResponse {
        public String message;
        public long timestamp;

        public ErrorResponse(String message) {
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }

        public String getMessage() {
            return message;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }

    public static class HealthResponse {
        public String status;

        public HealthResponse(String status) {
            this.status = status;
        }

        public String getStatus() {
            return status;
        }
    }
}
