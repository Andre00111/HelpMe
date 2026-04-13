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
            log.info("📥 [LocationController] POST /api/location - userId: {}, lat: {}, lng: {}, accuracy: {}",
                    userId, locationDTO.getLatitude(), locationDTO.getLongitude(), locationDTO.getAccuracy());
            LocationDTO savedLocation = locationService.saveLocation(userId, locationDTO);
            log.info("✅ [LocationController] Location saved - userId: {}, id: {}", userId, savedLocation.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLocation);
        } catch (IllegalArgumentException e) {
            log.error("❌ [LocationController] Invalid argument: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [LocationController] Error saving location: {}", e.getMessage(), e);
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
            log.info("📥 [LocationController] GET /api/location/latest - userId: {}", userId);
            LocationDTO location = locationService.getLatestLocation(userId);
            log.info("✅ [LocationController] Latest location retrieved - userId: {}, lat: {}, lng: {}",
                    userId, location.getLatitude(), location.getLongitude());
            return ResponseEntity.ok(location);
        } catch (IllegalArgumentException e) {
            log.error("❌ [LocationController] Location not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [LocationController] Error retrieving latest location: {}", e.getMessage(), e);
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
            log.info("📥 [LocationController] GET /api/location/history - userId: {}", userId);
            List<LocationDTO> locations = locationService.getLocationHistory(userId);
            log.info("✅ [LocationController] Location history retrieved - userId: {}, count: {}", userId, locations.size());
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            log.error("❌ [LocationController] Error retrieving location history: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    /**
     * Get all latest locations for all users (for dashboard/cockpit)
     * GET /api/location/people
     * NOTE: Currently public for testing. Should require Cockpit admin auth in production.
     * Returns locations ONLY, without health status
     * Status is sent separately via /api/status endpoint
     */
    @GetMapping("/people")
    public ResponseEntity<?> getAllLatestLocations() {
        try {
            log.info("📥 [LocationController] GET /api/location/people - Fetching all people with locations");
            var locations = locationService.getAllLatestLocations();
            log.info("✅ [LocationController] All people locations retrieved - count: {}", locations.size());
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            log.error("❌ [LocationController] Error retrieving all people locations: {}", e.getMessage(), e);
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
            log.info("📥 [LocationController] GET /api/location/people/{} - Fetching location for user", userId);
            LocationDTO location = locationService.getLatestLocation(userId);
            log.info("✅ [LocationController] User location retrieved - userId: {}, lat: {}, lng: {}",
                    userId, location.getLatitude(), location.getLongitude());
            return ResponseEntity.ok(location);
        } catch (IllegalArgumentException e) {
            log.error("❌ [LocationController] Location not found for userId {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [LocationController] Error retrieving user location: {}", e.getMessage(), e);
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
