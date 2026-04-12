package com.helpme.controller;

import com.helpme.dto.LocationDTO;
import com.helpme.security.JwtTokenProvider;
import com.helpme.service.LocationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/location")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class LocationController {

    @Autowired
    private LocationService locationService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Save a new location for the authenticated user
     * POST /api/location
     */
    @PostMapping
    public ResponseEntity<?> saveLocation(
            @Valid @RequestBody LocationDTO locationDTO,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            LocationDTO savedLocation = locationService.saveLocation(userId, locationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLocation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error saving location", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    /**
     * Get the latest location for the authenticated user
     * GET /api/location/latest
     */
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestLocation(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            LocationDTO location = locationService.getLatestLocation(userId);
            return ResponseEntity.ok(location);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    /**
     * Get location history for the authenticated user
     * GET /api/location/history
     */
    @GetMapping("/history")
    public ResponseEntity<?> getLocationHistory(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            List<LocationDTO> locations = locationService.getLocationHistory(userId);
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    /**
     * Get all latest locations for all users (for dashboard/cockpit)
     * GET /api/location/people
     * NOTE: Currently public for testing. Should require Cockpit admin auth in production.
     */
    @GetMapping("/people")
    public ResponseEntity<?> getAllLatestLocations() {
        try {
            List<LocationDTO> locations = locationService.getAllLatestLocations();
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Fehler beim Abrufen der Standorte"));
        }
    }

    /**
     * Get latest location for a specific user (for dashboard/cockpit)
     * GET /api/location/people/{userId}
     * NOTE: Currently public for testing. Should require Cockpit admin auth in production.
     */
    @GetMapping("/people/{userId}")
    public ResponseEntity<?> getUserLatestLocation(
            @PathVariable Long userId) {
        try {
            LocationDTO location = locationService.getLatestLocation(userId);
            return ResponseEntity.ok(location);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Fehler beim Abrufen des Standorts"));
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
}
