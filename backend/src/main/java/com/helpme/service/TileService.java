package com.helpme.service;

import com.helpme.dto.TileDTO;
import com.helpme.entity.Tile;
import com.helpme.entity.User;
import com.helpme.repository.TileRepository;
import com.helpme.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TileService {

    @Autowired
    private TileRepository tileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TileDTO> getTilesByUser(Long userId) {
        User user = getUserOrThrow(userId);
        List<Tile> tiles = tileRepository.findByUserAndActiveTrueOrderByPosition(user);
        return tiles.stream()
                .map(TileDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TileDTO> getTilesByCategory(Long userId, String categoryStr) {
        User user = getUserOrThrow(userId);
        Tile.TileCategory category = parseCategoryOrThrow(categoryStr);
        List<Tile> tiles = tileRepository.findByUserAndCategoryAndActiveTrue(user, category);
        return tiles.stream()
                .map(TileDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TileDTO createTile(Long userId, TileDTO tileDTO) {
        User user = getUserOrThrow(userId);
        Tile.TileCategory category = parseCategoryOrThrow(tileDTO.getCategory());

        // Bestimme Position
        long count = tileRepository.countByUserAndActiveTrue(user);
        int position = (int) count;

        Tile tile = Tile.builder()
                .title(tileDTO.getTitle())
                .text(tileDTO.getText())
                .color(tileDTO.getColor())
                .category(category)
                .user(user)
                .position(position)
                .active(true)
                .build();

        Tile savedTile = tileRepository.save(tile);
        log.info("Tile created for user {}: {}", userId, savedTile.getTitle());
        return TileDTO.from(savedTile);
    }

    @Transactional
    public TileDTO updateTile(Long userId, Long tileId, TileDTO tileDTO) {
        User user = getUserOrThrow(userId);
        Tile tile = getTileOrThrow(tileId, user);

        Tile.TileCategory category = parseCategoryOrThrow(tileDTO.getCategory());

        tile.setTitle(tileDTO.getTitle());
        tile.setText(tileDTO.getText());
        tile.setColor(tileDTO.getColor());
        tile.setCategory(category);
        if (tileDTO.getPosition() != null) {
            tile.setPosition(tileDTO.getPosition());
        }

        Tile updatedTile = tileRepository.save(tile);
        log.info("Tile updated for user {}: {}", userId, updatedTile.getTitle());
        return TileDTO.from(updatedTile);
    }

    @Transactional
    public void deleteTile(Long userId, Long tileId) {
        User user = getUserOrThrow(userId);
        Tile tile = getTileOrThrow(tileId, user);

        tile.setActive(false);
        tileRepository.save(tile);
        log.info("Tile deleted for user {}: {}", userId, tileId);
    }

    @Transactional(readOnly = true)
    public TileDTO getTile(Long userId, Long tileId) {
        User user = getUserOrThrow(userId);
        Tile tile = getTileOrThrow(tileId, user);
        return TileDTO.from(tile);
    }

    @Transactional
    public void reorderTiles(Long userId, List<Long> tileIds) {
        User user = getUserOrThrow(userId);

        for (int i = 0; i < tileIds.size(); i++) {
            Tile tile = getTileOrThrow(tileIds.get(i), user);
            tile.setPosition(i);
            tileRepository.save(tile);
        }

        log.info("Tiles reordered for user {}", userId);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden"));
    }

    private Tile getTileOrThrow(Long tileId, User user) {
        return tileRepository.findByIdAndUserAndActiveTrue(tileId, user)
                .orElseThrow(() -> new IllegalArgumentException("Kachel nicht gefunden"));
    }

    private Tile.TileCategory parseCategoryOrThrow(String categoryStr) {
        try {
            return Tile.TileCategory.valueOf(categoryStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Ungültige Kategorie: " + categoryStr);
        }
    }
}
