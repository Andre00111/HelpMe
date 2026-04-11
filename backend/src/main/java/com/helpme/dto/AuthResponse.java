package com.helpme.dto;

import com.helpme.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private Boolean isHelper;

    public static AuthResponse from(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .isHelper(user.getIsHelper())
                .build();
    }
}
