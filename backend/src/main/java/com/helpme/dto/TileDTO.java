package com.helpme.dto;

import com.helpme.entity.Tile;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TileDTO {

    private Long id;

    @NotBlank(message = "Titel ist erforderlich")
    private String title;

    @NotBlank(message = "Text ist erforderlich")
    private String text;

    @NotBlank(message = "Farbe ist erforderlich")
    private String color;

    @NotBlank(message = "Kategorie ist erforderlich")
    private String category;

    private Integer position;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Boolean active;

    public static TileDTO from(Tile tile) {
        return TileDTO.builder()
                .id(tile.getId())
                .title(tile.getTitle())
                .text(tile.getText())
                .color(tile.getColor())
                .category(tile.getCategory().name())
                .position(tile.getPosition())
                .createdAt(tile.getCreatedAt())
                .updatedAt(tile.getUpdatedAt())
                .active(tile.getActive())
                .build();
    }

    public Tile toEntity(Tile.TileCategory category) {
        return Tile.builder()
                .title(this.title)
                .text(this.text)
                .color(this.color)
                .category(category)
                .position(this.position)
                .active(true)
                .build();
    }
}
