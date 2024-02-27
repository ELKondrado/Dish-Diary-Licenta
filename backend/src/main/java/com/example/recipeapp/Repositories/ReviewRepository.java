package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query(value = "SELECT * FROM review r JOIN recipe_review rr ON r.id = rr.review_id WHERE rr.recipe_id = :recipeId", nativeQuery = true)
    List<Review> findReviewsByRecipeId(Long recipeId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM recipe_review WHERE recipe_id = :recipeId AND review_id = :reviewId", nativeQuery = true)
    void deleteReviewOfRecipe(@Param("recipeId") long recipeId, @Param("reviewId") long reviewId);

}
