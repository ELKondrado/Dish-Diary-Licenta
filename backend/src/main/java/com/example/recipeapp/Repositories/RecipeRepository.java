package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe,Long> {
    @Query("SELECT r FROM Recipe r WHERE r.name = ?1")
    Optional<Recipe> findRecipeByName(String name);

    Optional<Recipe> findRecipeById(Long id);

}