package com.helpme.dto;

import com.helpme.entity.HealthStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonWithStatusDTO {

    private Long id;

    private Long userId;

    private String userName;

    private Double latitude;

    private Double longitude;

    private Double accuracy;

    private LocalDateTime locationTimestamp;

    // Health status - can be null if not set
    private HealthStatus healthStatus;

    private String healthStatusLabel;

    private String healthStatusColor;

    private LocalDateTime statusTimestamp;

}
