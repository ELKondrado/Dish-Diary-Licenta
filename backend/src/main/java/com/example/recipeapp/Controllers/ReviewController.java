package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Services.RecipeService;
import com.example.recipeapp.Services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/recipe/review")
public class ReviewController {
    private final ReviewService reviewService;
    private final RecipeService recipeService;

    @Autowired
    public ReviewController(ReviewService reviewService, RecipeService recipeService) {
        this.reviewService = reviewService;
        this.recipeService = recipeService;
    }

    @PostMapping("/addReviewToRecipe/{recipeId}/{username}")
    public ResponseEntity<Review> addReview(@RequestBody Review review,
                                            @PathVariable("recipeId") long recipeId,
                                            @PathVariable("username") String username){
        Recipe recipe = recipeService.findRecipeById(recipeId);
        Review newReview = reviewService.addReviewToRecipe(review, recipe, username);
        return new ResponseEntity<>(newReview, HttpStatus.CREATED);
    }

    @GetMapping("/getReviewsForRecipe/{recipeId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable("recipeId") long recipeId){
        List<Review> reviews = reviewService.getReviewsForRecipe(recipeId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PutMapping("/likeReview/{reviewId}/{userId}")
    public ResponseEntity<Review> likeReview(@PathVariable("reviewId") Long reviewId,
                                             @PathVariable("userId") Long userId) {
        Review review = reviewService.likeReview(reviewId, userId);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    @PutMapping("/dislikeReview/{reviewId}/{userId}")
    public ResponseEntity<Review> dislikeReview(@PathVariable("reviewId") Long reviewId,
                                                @PathVariable("userId") Long userId) {
        Review review = reviewService.dislikeReview(reviewId, userId);
        return new ResponseEntity<Review>(review, HttpStatus.OK);
    }

    @GetMapping("/getLikedReviews/{userId}")
    public ResponseEntity<List<Review>> getLikedReviews(@PathVariable("userId") Long userId) {
        List<Review> likedReviews = reviewService.getLikedReviews(userId);
        return new ResponseEntity<>(likedReviews, HttpStatus.OK);
    }

    @DeleteMapping("/deleteReview/{recipeId}/{reviewId}")
    public ResponseEntity<Review> deleteReview(@PathVariable("recipeId") Long recipeId,
                                               @PathVariable("reviewId") Long reviewId){
        reviewService.deleteReview(recipeId, reviewId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
