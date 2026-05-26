package com.project.skin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.project.skin.model.User;
import com.project.skin.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    // LOGIN
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User u = authService.login(user.getEmail(), user.getPassword());
        if (u != null) {
            return "LOGIN SUCCESS";
        }
        return "INVALID CREDENTIALS";
    }

    // GET PROFILE
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String email) {

        User user = authService.getProfile(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    // ✅ SAVE / UPDATE PROFILE (THIS WAS MISSING)
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User user) {

        User updatedUser = authService.updateProfile(user);

        if (updatedUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        return ResponseEntity.ok(updatedUser);
    }
}
