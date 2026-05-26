package com.project.skin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.skin.model.User;
import com.project.skin.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    // REGISTER
    public User register(User user) {
        return userRepo.save(user);
    }

    // LOGIN
    public User login(String email, String password) {
        User user = userRepo.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // 👤 GET PROFILE
    public User getProfile(String email) {
        return userRepo.findByEmail(email);
    }
	// ✅ UPDATE PROFILE (NEW - REQUIRED FOR SAVE & CONTINUE)
    public User updateProfile(User user) {

        User existingUser = userRepo.findByEmail(user.getEmail());

        if (existingUser == null) {
            return null;
        }

        existingUser.setAge(user.getAge());
        existingUser.setGender(user.getGender());
        existingUser.setCity(user.getCity());
        existingUser.setPhone(user.getPhone());

        return userRepo.save(existingUser);
    }
}
