package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Services.RecipeService;
import com.example.recipeapp.Services.ReviewService;
import com.example.recipeapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/recipe/review")
public class ReviewController {
    private final ReviewService reviewService;
    private final RecipeService recipeService;
    private final UserService userService;

    @Autowired
    public ReviewController(ReviewService reviewService, RecipeService recipeService, UserService userService) {
        this.reviewService = reviewService;
        this.recipeService = recipeService;
        this.userService = userService;
    }

    @PostMapping("/addReviewToRecipe/{recipeId}/{username}")
    public ResponseEntity<Review> addReview(@RequestBody Review review,
                                            @PathVariable("recipeId") long recipeId,
                                            @PathVariable("username") String username){
        Optional<User> optionalUser = userService.findUserByUserName(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Recipe recipe = recipeService.findRecipeById(recipeId);
            Review newReview = reviewService.addReviewToRecipe(review, recipe, user);
            return new ResponseEntity<>(newReview, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getReviewsForRecipe/{recipeId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable("recipeId") long recipeId){
        List<Review> reviews = reviewService.getReviewsForRecipe(recipeId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PutMapping("/likeReview/{reviewId}/{userId}")
    public ResponseEntity<Review> likeReview(@PathVariable("reviewId") Long reviewId,
                                             @PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userService.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Review> optionalReview = reviewService.findReviewById(reviewId);
            if (optionalReview.isPresent()) {
                Review review = optionalReview.get();
                review = reviewService.likeReview(review, user);
                return new ResponseEntity<Review>(review, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/dislikeReview/{reviewId}/{userId}")
    public ResponseEntity<Review> dislikeReview(@PathVariable("reviewId") Long reviewId,
                                                @PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userService.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Review> optionalReview = reviewService.findReviewById(reviewId);
            if (optionalReview.isPresent()) {
                Review review = optionalReview.get();
                review = reviewService.dislikeReview(review, user);
                return new ResponseEntity<Review>(review, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getLikedReviews/{userId}")
    public ResponseEntity<List<Review>> getLikedReviews(@PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userService.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Review> likedReviews = reviewService.getLikedReviews(user.getUserId());
            return new ResponseEntity<>(likedReviews, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deleteReview/{recipeId}/{reviewId}")
    public ResponseEntity<Review> deleteReview(@PathVariable("recipeId") Long recipeId,
                                               @PathVariable("reviewId") Long reviewId){
        reviewService.deleteReview(recipeId, reviewId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
