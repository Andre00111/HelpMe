package com.helpme.service;

import com.helpme.dto.LoginRequest;
import com.helpme.dto.RegisterRequest;
import com.helpme.entity.User;
import com.helpme.entity.UserProfile;
import com.helpme.repository.UserRepository;
import com.helpme.repository.UserProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(RegisterRequest request) {
        // Validiere dass Passwörter gleich sind
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("Passwörter stimmen nicht überein");
        }

        // Prüfe ob Email bereits existiert
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-Mail-Adresse wird bereits verwendet");
        }

        // Lade Profil
        UserProfile profile = null;
        if (request.getProfileId() != null) {
            profile = userProfileRepository.findById(request.getProfileId())
                    .orElseThrow(() -> new IllegalArgumentException("Profil nicht gefunden"));
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .isHelper(request.getIsHelper())
                .profile(profile)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());
        return savedUser;
    }

    @Transactional
    public User loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Ungültige E-Mail oder Passwort"));

        if (!user.getActive()) {
            throw new IllegalArgumentException("Benutzerkonto ist deaktiviert");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Ungültige E-Mail oder Passwort");
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        log.info("User logged in successfully: {}", updatedUser.getEmail());
        return updatedUser;
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden"));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden"));
    }

    @Transactional
    public User updateUser(Long id, String name) {
        User user = getUserById(id);
        user.setName(name);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
        log.info("User deactivated: {}", user.getEmail());
    }

    @Transactional(readOnly = true)
    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findAll();
    }
}
