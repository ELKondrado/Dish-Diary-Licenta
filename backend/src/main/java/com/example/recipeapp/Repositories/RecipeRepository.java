package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Recipe.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @Query("SELECT r " +
           "FROM Recipe r " +
           "WHERE r.name = ?1")
    Optional<Recipe> findRecipeByName(String name);

    Optional<Recipe> findRecipeById(Long id);

    @Query("SELECT r " +
           "FROM Recipe r " +
           "WHERE r.userOwner.userId = :userId")
    List<Recipe> findRecipesByOwner(@Param("userId") Long userId);

    List<Recipe> findByRepositories_id(long repositoryId);

    @Query("SELECT DISTINCT  rec " +
            "FROM Recipe rec " +
            "JOIN rec.repositories repo " +
            "JOIN repo.recipes repoRec " +
            "WHERE repo.userOwner.userId = :userId")
    List<Recipe> findUserTotalRecipes(long userId);
}
