package com.helpme.controller;

import com.helpme.dto.TileDTO;
import com.helpme.security.JwtTokenProvider;
import com.helpme.service.TileService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tiles")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class TileController {

    @Autowired
    private TileService tileService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public ResponseEntity<?> getTiles(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            log.info("📥 [TileController] GET /tiles - userId: {}", userId);
            List<TileDTO> tiles = tileService.getTilesByUser(userId);
            log.info("✅ [TileController] Tiles retrieved - userId: {}, count: {}", userId, tiles.size());
            return ResponseEntity.ok(tiles);
        } catch (Exception e) {
            log.error("❌ [TileController] Error retrieving tiles: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getTilesByCategory(
            @PathVariable String category,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            log.info("📥 [TileController] GET /tiles/category/{} - userId: {}", category, userId);
            List<TileDTO> tiles = tileService.getTilesByCategory(userId, category);
            log.info("✅ [TileController] Tiles by category retrieved - userId: {}, category: {}, count: {}",
                    userId, category, tiles.size());
            return ResponseEntity.ok(tiles);
        } catch (IllegalArgumentException e) {
            log.error("❌ [TileController] Invalid argument for category {}: {}", category, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [TileController] Error retrieving tiles by category: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTile(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            log.info("📥 [TileController] GET /tiles/{} - userId: {}", id, userId);
            TileDTO tile = tileService.getTile(userId, id);
            log.info("✅ [TileController] Tile retrieved - userId: {}, tileId: {}", userId, id);
            return ResponseEntity.ok(tile);
        } catch (IllegalArgumentException e) {
            log.error("❌ [TileController] Tile not found - tileId: {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [TileController] Error retrieving tile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createTile(
            @Valid @RequestBody TileDTO tileDTO,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            log.info("📥 [TileController] POST /tiles - userId: {}, title: {}, category: {}",
                    userId, tileDTO.getTitle(), tileDTO.getCategory());
            TileDTO createdTile = tileService.createTile(userId, tileDTO);
            log.info("✅ [TileController] Tile created - userId: {}, tileId: {}", userId, createdTile.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTile);
        } catch (IllegalArgumentException e) {
            log.error("❌ [TileController] Invalid argument: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [TileController] Error creating tile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTile(
            @PathVariable Long id,
            @Valid @RequestBody TileDTO tileDTO,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            log.info("📥 [TileController] PUT /tiles/{} - userId: {}, title: {}", id, userId, tileDTO.getTitle());
            TileDTO updatedTile = tileService.updateTile(userId, id, tileDTO);
            log.info("✅ [TileController] Tile updated - userId: {}, tileId: {}", userId, id);
            return ResponseEntity.ok(updatedTile);
        } catch (IllegalArgumentException e) {
            log.error("❌ [TileController] Tile not found - tileId: {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [TileController] Error updating tile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTile(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            log.info("📥 [TileController] DELETE /tiles/{} - userId: {}", id, userId);
            tileService.deleteTile(userId, id);
            log.info("✅ [TileController] Tile deleted - userId: {}, tileId: {}", userId, id);
            return ResponseEntity.ok(new SuccessResponse("Kachel gelöscht"));
        } catch (IllegalArgumentException e) {
            log.error("❌ [TileController] Tile not found - tileId: {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ [TileController] Error deleting tile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
        }
    }

    @PostMapping("/reorder")
    public ResponseEntity<?> reorderTiles(
            @RequestBody Map<String, List<Long>> payload,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            List<Long> tileIds = payload.get("tileIds");
            log.info("📥 [TileController] POST /tiles/reorder - userId: {}, count: {}", userId, tileIds.size());
            tileService.reorderTiles(userId, tileIds);
            log.info("✅ [TileController] Tiles reordered - userId: {}, count: {}", userId, tileIds.size());
            return ResponseEntity.ok(new SuccessResponse("Kacheln neu angeordnet"));
        } catch (Exception e) {
            log.error("❌ [TileController] Error reordering tiles: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentifizierung erforderlich"));
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
