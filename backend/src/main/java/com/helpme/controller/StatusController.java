package com.helpme.controller;

import com.helpme.entity.HealthStatus;
import com.helpme.entity.HealthStatusUpdate;
import com.helpme.security.JwtTokenProvider;
import com.helpme.service.HealthStatusService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/status")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class StatusController {

    @Autowired
    private HealthStatusService healthStatusService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Save a new health status for the authenticated user
     * POST /api/status
     */
    @PostMapping
    public ResponseEntity<?> saveStatus(
            @RequestBody StatusUpdateRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            log.info("📥 [StatusController] POST /api/status - userId: {}, status: {}, timestamp: {}",
                    userId, request.healthStatus, request.timestamp);
            healthStatusService.saveHealthStatus(userId, request.healthStatus);
            log.info("✅ [StatusController] Health status saved - userId: {}, status: {}", userId, request.healthStatus);
            return ResponseEntity.ok(new SuccessResponse("Status erfolgreich gespeichert"));
        } catch (IllegalArgumentException e) {
            log.error("❌ [StatusController] Invalid argument: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [StatusController] Error saving status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    /**
     * Get all latest health statuses for all users (for dashboard/cockpit)
     * GET /api/status/latest/all
     * NOTE: Currently public for testing. Should require Cockpit admin auth in production.
     */
    @GetMapping("/latest/all")
    public ResponseEntity<?> getAllLatestStatuses() {
        try {
            log.info("📥 [StatusController] GET /api/status/latest/all - Fetching all latest statuses");
            List<HealthStatusUpdate> statuses = healthStatusService.getAllLatestStatuses();
            List<StatusResponse> response = statuses.stream()
                    .map(status -> new StatusResponse(
                            status.getUser().getId(),
                            status.getUser().getName(),
                            status.getHealthStatus().name(),
                            status.getHealthStatus().getLabel(),
                            status.getHealthStatus().getColor(),
                            status.getCreatedAt().toString()))
                    .collect(Collectors.toList());
            log.info("✅ [StatusController] All latest statuses retrieved - count: {}", response.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ [StatusController] Error retrieving all statuses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Fehler beim Abrufen der Status"));
        }
    }

    private Long extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Ungültiger Authorization Header");
        }
        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Ungültiger Token");
        }
        return jwtTokenProvider.getUserIdFromToken(token);
    }

    /**
     * Request body for status update
     */
    public static class StatusUpdateRequest {
        public HealthStatus healthStatus;
        public String timestamp;

        public StatusUpdateRequest() {}

        public StatusUpdateRequest(HealthStatus healthStatus, String timestamp) {
            this.healthStatus = healthStatus;
            this.timestamp = timestamp;
        }

        public HealthStatus getHealthStatus() {
            return healthStatus;
        }

        public void setHealthStatus(HealthStatus healthStatus) {
            this.healthStatus = healthStatus;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }
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

    public static class SuccessResponse {
        public String message;
        public long timestamp;

        public SuccessResponse(String message) {
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

    public static class StatusResponse {
        public Long userId;
        public String userName;
        public String healthStatus;
        public String healthStatusLabel;
        public String healthStatusColor;
        public String timestamp;

        public StatusResponse(Long userId, String userName, String healthStatus,
                            String healthStatusLabel, String healthStatusColor, String timestamp) {
            this.userId = userId;
            this.userName = userName;
            this.healthStatus = healthStatus;
            this.healthStatusLabel = healthStatusLabel;
            this.healthStatusColor = healthStatusColor;
            this.timestamp = timestamp;
        }

        public Long getUserId() {
            return userId;
        }

        public String getUserName() {
            return userName;
        }

        public String getHealthStatus() {
            return healthStatus;
        }

        public String getHealthStatusLabel() {
            return healthStatusLabel;
        }

        public String getHealthStatusColor() {
            return healthStatusColor;
        }

        public String getTimestamp() {
            return timestamp;
        }
    }
}
