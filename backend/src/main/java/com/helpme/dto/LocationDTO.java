package com.helpme.dto;

import com.helpme.entity.Location;
import com.helpme.entity.HealthStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationDTO {

    private Long id;

    private Long userId;

    private String userName;

    @NotNull(message = "Breitengrad ist erforderlich")
    private Double latitude;

    @NotNull(message = "Längengrad ist erforderlich")
    private Double longitude;

    @NotNull(message = "Genauigkeit ist erforderlich")
    private Double accuracy;

    private LocalDateTime timestamp;

    private HealthStatus healthStatus;

    private String healthStatusLabel;

    private String healthStatusColor;

    public static LocationDTO from(Location location) {
        HealthStatus status = location.getHealthStatus() != null ? location.getHealthStatus() : HealthStatus.GOOD;
        return LocationDTO.builder()
                .id(location.getId())
                .userId(location.getUser().getId())
                .userName(location.getUser().getName())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .accuracy(location.getAccuracy())
                .timestamp(location.getCreatedAt())
                .healthStatus(status)
                .healthStatusLabel(status.getLabel())
                .healthStatusColor(status.getColor())
                .build();
    }

    public Location toEntity() {
        return Location.builder()
                .latitude(this.latitude)
                .longitude(this.longitude)
                .accuracy(this.accuracy)
                .healthStatus(this.healthStatus != null ? this.healthStatus : HealthStatus.GOOD)
                .build();
    }
}
