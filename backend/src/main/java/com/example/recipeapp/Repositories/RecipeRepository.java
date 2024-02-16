package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe,Long> {
    @Query("SELECT r FROM Recipe r WHERE r.name = ?1")
    Optional<Recipe> findRecipeByName(String name);

    @Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.users WHERE r.name = ?1")
    Optional<Recipe> findRecipeWithUsersByName(String name);

    Optional<Recipe> findRecipeById(Long id);

    @Query("SELECT r FROM Recipe r WHERE r.name = :#{#recipe.name} AND r.ingredients = :#{#recipe.ingredients} AND r.stepsOfPreparation = :#{#recipe.stepsOfPreparation}")
    Optional<Recipe> findRecipe(@Param("recipe") Recipe recipe);

    List<Recipe> findByUsers_UserId(Long userId);
}
