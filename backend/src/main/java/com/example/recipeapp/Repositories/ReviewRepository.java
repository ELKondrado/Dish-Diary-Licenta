package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(value = "SELECT * FROM review r JOIN recipe_review rr ON r.id = rr.review_id WHERE rr.recipe_id = :recipeId", nativeQuery = true)
    List<Review> findReviewsByRecipeId(Long recipeId);
}
