package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    @Query("SELECT u FROM User u WHERE u.userName = ?1")
    Optional<User> findUserByUserName(String name);

    Boolean existsByUserName(String username);
}
