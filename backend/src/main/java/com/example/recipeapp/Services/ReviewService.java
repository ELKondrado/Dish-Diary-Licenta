package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.RecipeNotFoundException;
import com.example.recipeapp.Exceptions.ReviewNotFoundException;
import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RecipeRepository;
import com.example.recipeapp.Repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Service
public class ReviewService {
    private final RecipeRepository recipeRepository;
    private final ReviewRepository reviewRepository;

    @PersistenceContext
    private EntityManager em;
    @Autowired
    public ReviewService(RecipeRepository recipeRepository, ReviewRepository reviewRepository) {
        this.recipeRepository = recipeRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public Review addReviewToRecipe(Review review, Recipe recipe, User user) {
        review.setUserOwner(user);
        recipe.getReviews().add(review);
        recipeRepository.save(recipe);
        return review;
    }

    public List<Review> getReviewsForRecipe(long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with id: " + recipeId + " does not exist"));

        return reviewRepository.findReviewsByRecipeId(recipe.getId());
    }

    public void deleteReview(Long recipeId, Long reviewId) {
        boolean exists = recipeRepository.existsById(recipeId);
        if (!exists) {
            throw new RecipeNotFoundException("Recipe with id: " + recipeId + " does not exist");
        }
        exists = reviewRepository.existsById(reviewId);
        if (!exists) {
            throw new ReviewNotFoundException("Review with id: " + reviewId + " does not exist");
        }
        reviewRepository.deleteReviewOfRecipe(recipeId, reviewId);
    }
}
