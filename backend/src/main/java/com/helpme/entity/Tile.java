package com.helpme.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tiles", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_category", columnList = "category")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Titel ist erforderlich")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Text ist erforderlich")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @NotBlank(message = "Farbe ist erforderlich")
    @Column(nullable = false)
    private String color;

    @NotBlank(message = "Kategorie ist erforderlich")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TileCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "position")
    private Integer position;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    public enum TileCategory {
        ZUHAUSE("Zuhause"),
        DRAUSSEN("Draußen"),
        ARZT("Arzt"),
        ESSEN("Essen"),
        NOTFALL("Notfall");

        private final String displayName;

        TileCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
