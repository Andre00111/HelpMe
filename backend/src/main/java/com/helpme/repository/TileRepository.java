package com.helpme.repository;

import com.helpme.entity.Tile;
import com.helpme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TileRepository extends JpaRepository<Tile, Long> {

    List<Tile> findByUserAndActiveTrueOrderByPosition(User user);

    List<Tile> findByUserAndCategoryAndActiveTrue(User user, Tile.TileCategory category);

    Optional<Tile> findByIdAndUserAndActiveTrue(Long id, User user);

    long countByUserAndActiveTrue(User user);

    void deleteByIdAndUser(Long id, User user);
}
