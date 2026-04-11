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
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
            AuthResponse response = AuthResponse.from(user, token);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.loginUser(request);
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
            AuthResponse response = AuthResponse.from(user, token);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
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
