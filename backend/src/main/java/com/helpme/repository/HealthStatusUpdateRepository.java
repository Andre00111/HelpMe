package com.helpme.repository;

import com.helpme.entity.HealthStatusUpdate;
import com.helpme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthStatusUpdateRepository extends JpaRepository<HealthStatusUpdate, Long> {

    /**
     * Find the latest health status update for a specific user
     */
    Optional<HealthStatusUpdate> findFirstByUserOrderByCreatedAtDesc(User user);

    /**
     * Find the latest health status for each user (for dashboard display)
     */
    @Query(value = """
            SELECT DISTINCT ON (hsu.user_id) hsu.* FROM health_status_updates hsu
            ORDER BY hsu.user_id, hsu.created_at DESC
            """, nativeQuery = true)
    java.util.List<HealthStatusUpdate> findLatestStatusForEachUser();
}
