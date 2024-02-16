package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.userName = ?1")
    Optional<User> findUserByUserName(String name);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_recipes WHERE user_id = :userId AND recipe_id = :recipeId", nativeQuery = true)
    void deleteUserRecipe(@Param("userId") long userId, @Param("recipeId") long recipeId);

    Boolean existsByUserName(String username);
}
