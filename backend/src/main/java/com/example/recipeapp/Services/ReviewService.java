package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RecipeRepository;
import com.example.recipeapp.Repositories.ReviewRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    private final RecipeRepository recipeRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager em;

    @Autowired
    public ReviewService(RecipeRepository recipeRepository, ReviewRepository reviewRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    public Optional<Review> findReviewById(Long reviewId){
        return reviewRepository.findById(reviewId);
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
                .orElseThrow(() -> new NotFound("Recipe with id: " + recipeId + " does not exist"));

        return reviewRepository.findReviewsByRecipeId(recipe.getId());
    }

    @Transactional
    public Review likeReview(Review review, User user){
        review.setLikes(review.getLikes() + 1);
        review.getLikedByUsers().add(user);
        user.getLikedReviews().add(review);
        userRepository.save(user);
        return reviewRepository.save(review);
    }

    @Transactional
    public Review dislikeReview(Review review, User user){
        review.setLikes(review.getLikes() - 1);
        review.getLikedByUsers().remove(user);
        user.getLikedReviews().remove(review);
        userRepository.save(user);
        return reviewRepository.save(review);
    }

    public List<Review> getLikedReviews(Long userId) {
        return reviewRepository.getLikedReviewsByUser(userId);
    }

    public void deleteReview(Long recipeId, Long reviewId) {
        boolean exists = recipeRepository.existsById(recipeId);
        if (!exists) {
            throw new NotFound("Recipe with id: " + recipeId + " does not exist");
        }
        exists = reviewRepository.existsById(reviewId);
        if (!exists) {
            throw new NotFound("Review with id: " + reviewId + " does not exist");
        }
        reviewRepository.deleteReviewOfRecipe(recipeId, reviewId);
    }
}
