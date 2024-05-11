package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RecipeRepository;
import com.example.recipeapp.Repositories.ReviewRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;


    @Autowired
    public ReviewService(RecipeRepository recipeRepository, ReviewRepository reviewRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Review addReviewToRecipe(Review review, Recipe recipe, String username) {
        Optional<User> optionalUser = userRepository.findUserByUserName(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            review.setUserOwner(user);
            recipe.getReviews().add(review);
            recipeRepository.save(recipe);
            return reviewRepository.save(review);
        } else {
            throw new NotFound("User with username " + username + " not found in adding review to recipe + " + recipe.getName());
        }
    }

    public List<Review> getReviewsForRecipe(long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new NotFound("Recipe with id: " + recipeId + " does not exist in getting review for recipe"));

        return reviewRepository.findReviewsByRecipeId(recipe.getId());
    }

    @Transactional
    public Review likeReview(long reviewId, long userId){
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            Optional<Review> optionalReview = reviewRepository.findById(reviewId);
            if (optionalReview.isPresent()) {
                Review review = optionalReview.get();

                review.setLikes(review.getLikes() + 1);
                review.getLikedByUsers().add(user);
                user.getLikedReviews().add(review);
                userRepository.save(user);
                return reviewRepository.save(review);
            } else {
                throw new NotFound("Review with id " + reviewId + " not found in liking review");
            }
        }
        else {
            throw new NotFound("User with id " + userId + " not found in liking review");
        }
    }

    @Transactional
    public Review dislikeReview(long reviewId, long userId){
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            Optional<Review> optionalReview = reviewRepository.findById(reviewId);
            if (optionalReview.isPresent()) {
                Review review = optionalReview.get();

                review.setLikes(review.getLikes() - 1);
                review.getLikedByUsers().remove(user);
                user.getLikedReviews().remove(review);
                userRepository.save(user);
                return reviewRepository.save(review);
            } else {
                throw new NotFound("Review with id " + reviewId + " not found in disliking review");
            }
        }
        else {
            throw new NotFound("User with id " + userId + " not found in disliking review");
        }
    }

    public List<Review> getLikedReviews(Long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return reviewRepository.getLikedReviewsByUser(user.getUserId());
        }
        else {
            throw new NotFound("User with id " + userId + " not found in getting liked reviews");
        }
    }

    public void deleteReview(Long recipeId, Long reviewId) {
        boolean exists = recipeRepository.existsById(recipeId);
        if (!exists) {
            throw new NotFound("Recipe with id: " + recipeId + " does not exist in deleting recipe");
        }
        exists = reviewRepository.existsById(reviewId);
        if (!exists) {
            throw new NotFound("Review with id: " + reviewId + " does not exist in deleting recipe");
        }
        reviewRepository.deleteReviewOfRecipe(recipeId, reviewId);
    }
}
