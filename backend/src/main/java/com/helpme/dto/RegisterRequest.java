package com.helpme.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name ist erforderlich")
    @Size(min = 2, max = 100, message = "Name muss zwischen 2 und 100 Zeichen lang sein")
    private String name;

    @Email(message = "Gültige E-Mail-Adresse erforderlich")
    @NotBlank(message = "E-Mail ist erforderlich")
    private String email;

    @NotBlank(message = "Passwort ist erforderlich")
    @Size(min = 6, message = "Passwort muss mindestens 6 Zeichen lang sein")
    private String password;

    @NotBlank(message = "Passwort-Bestätigung ist erforderlich")
    private String passwordConfirm;

    private Boolean isHelper = false;

    private Long profileId;  // Profil-ID bei Registration
}
