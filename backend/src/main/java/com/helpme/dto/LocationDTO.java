package com.helpme.dto;

import com.helpme.entity.Location;
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

    public static LocationDTO from(Location location) {
        return LocationDTO.builder()
                .id(location.getId())
                .userId(location.getUser().getId())
                .userName(location.getUser().getName())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .accuracy(location.getAccuracy())
                .timestamp(location.getCreatedAt())
                .build();
    }

    public Location toEntity() {
        return Location.builder()
                .latitude(this.latitude)
                .longitude(this.longitude)
                .accuracy(this.accuracy)
                .build();
    }
}
