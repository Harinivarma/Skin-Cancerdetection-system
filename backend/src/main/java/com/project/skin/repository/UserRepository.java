package com.project.skin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.skin.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
}
