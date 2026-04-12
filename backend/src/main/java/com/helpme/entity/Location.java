package com.helpme.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "locations", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Breitengrad ist erforderlich")
    @Column(nullable = false)
    private Double latitude;

    @NotNull(message = "Längengrad ist erforderlich")
    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    @Builder.Default
    private Double accuracy = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", nullable = false)
    @Builder.Default
    private HealthStatus healthStatus = HealthStatus.GOOD;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
