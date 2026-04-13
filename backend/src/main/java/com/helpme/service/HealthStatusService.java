package com.helpme.service;

import com.helpme.entity.HealthStatus;
import com.helpme.entity.HealthStatusUpdate;
import com.helpme.entity.User;
import com.helpme.repository.HealthStatusUpdateRepository;
import com.helpme.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class HealthStatusService {

    @Autowired
    private HealthStatusUpdateRepository statusRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Save a new health status update for a user
     */
    @Transactional
    public void saveHealthStatus(Long userId, HealthStatus healthStatus) {
        User user = getUserOrThrow(userId);

        HealthStatusUpdate statusUpdate = HealthStatusUpdate.builder()
                .user(user)
                .healthStatus(healthStatus)
                .build();

        statusRepository.save(statusUpdate);
        log.info("Health status saved for user {}: status={}", userId, healthStatus);
    }

    /**
     * Get the latest health status for a specific user
     */
    @Transactional(readOnly = true)
    public Optional<HealthStatus> getLatestStatus(Long userId) {
        User user = getUserOrThrow(userId);
        return statusRepository.findFirstByUserOrderByCreatedAtDesc(user)
                .map(HealthStatusUpdate::getHealthStatus);
    }

    /**
     * Get all latest health statuses for all users (for dashboard display)
     */
    @Transactional(readOnly = true)
    public List<HealthStatusUpdate> getAllLatestStatuses() {
        return statusRepository.findLatestStatusForEachUser();
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden"));
    }
}
