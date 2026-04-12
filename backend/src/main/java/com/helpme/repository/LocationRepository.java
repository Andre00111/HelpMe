package com.helpme.repository;

import com.helpme.entity.Location;
import com.helpme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    /**
     * Find the latest location for a specific user
     */
    Optional<Location> findFirstByUserOrderByCreatedAtDesc(User user);

    /**
     * Find all locations for a specific user
     */
    List<Location> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Find all locations for a specific user within a time range
     */
    List<Location> findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(
            User user, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * Find the latest location for each user (for dashboard display)
     */
    @Query(value = """
            SELECT DISTINCT ON (l.user_id) l.* FROM locations l
            ORDER BY l.user_id, l.created_at DESC
            """, nativeQuery = true)
    List<Location> findLatestLocationForEachUser();
}
