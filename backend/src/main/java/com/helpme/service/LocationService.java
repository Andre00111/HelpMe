package com.helpme.service;

import com.helpme.dto.LocationDTO;
import com.helpme.dto.PersonWithStatusDTO;
import com.helpme.entity.HealthStatus;
import com.helpme.entity.Location;
import com.helpme.entity.User;
import com.helpme.repository.HealthStatusUpdateRepository;
import com.helpme.repository.LocationRepository;
import com.helpme.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthStatusUpdateRepository healthStatusUpdateRepository;

    /**
     * Save a new location for a user
     */
    @Transactional
    public LocationDTO saveLocation(Long userId, LocationDTO locationDTO) {
        User user = getUserOrThrow(userId);

        // Always create a new location entry (don't update existing ones)
        Location location = Location.builder()
                .user(user)
                .latitude(locationDTO.getLatitude())
                .longitude(locationDTO.getLongitude())
                .accuracy(locationDTO.getAccuracy())
                .build();

        Location savedLocation = locationRepository.save(location);
        log.info("Location saved for user {}: lat={}, lng={}", userId,
                savedLocation.getLatitude(), savedLocation.getLongitude());

        return LocationDTO.from(savedLocation);
    }

    /**
     * Get the latest location for a specific user
     */
    @Transactional(readOnly = true)
    public LocationDTO getLatestLocation(Long userId) {
        User user = getUserOrThrow(userId);
        Location location = locationRepository.findFirstByUserOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new IllegalArgumentException("Keine Standortdaten für diesen Benutzer gefunden"));

        return LocationDTO.from(location);
    }

    /**
     * Get all locations for a specific user
     */
    @Transactional(readOnly = true)
    public List<LocationDTO> getLocationHistory(Long userId) {
        User user = getUserOrThrow(userId);
        List<Location> locations = locationRepository.findByUserOrderByCreatedAtDesc(user);

        return locations.stream()
                .map(LocationDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * Get locations for a specific user within a time range
     */
    @Transactional(readOnly = true)
    public List<LocationDTO> getLocationsByTimeRange(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        User user = getUserOrThrow(userId);
        List<Location> locations = locationRepository.findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(
                user, startTime, endTime);

        return locations.stream()
                .map(LocationDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * Get the latest location for all users (for dashboard display)
     */
    @Transactional(readOnly = true)
    public List<LocationDTO> getAllLatestLocations() {
        List<Location> locations = locationRepository.findLatestLocationForEachUser();

        return locations.stream()
                .map(LocationDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * Get the latest location and status for all users (for cockpit dashboard)
     */
    @Transactional(readOnly = true)
    public List<PersonWithStatusDTO> getAllPeopleWithStatus() {
        List<Location> locations = locationRepository.findLatestLocationForEachUser();

        return locations.stream()
                .map(location -> {
                    // Get latest status for this user, if any
                    var latestStatus = healthStatusUpdateRepository.findFirstByUserOrderByCreatedAtDesc(location.getUser());

                    PersonWithStatusDTO dto = PersonWithStatusDTO.builder()
                            .id(location.getId())
                            .userId(location.getUser().getId())
                            .userName(location.getUser().getName())
                            .latitude(location.getLatitude())
                            .longitude(location.getLongitude())
                            .accuracy(location.getAccuracy())
                            .locationTimestamp(location.getCreatedAt())
                            .build();

                    // Add status if it exists
                    if (latestStatus.isPresent()) {
                        var status = latestStatus.get();
                        dto.setHealthStatus(status.getHealthStatus());
                        dto.setHealthStatusLabel(status.getHealthStatus().getLabel());
                        dto.setHealthStatusColor(status.getHealthStatus().getColor());
                        dto.setStatusTimestamp(status.getCreatedAt());
                    }
                    // If no status exists, healthStatus remains null (not set)

                    return dto;
                })
                .collect(Collectors.toList());
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden"));
    }
}
