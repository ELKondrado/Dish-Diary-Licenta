package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.MessageRepository;
import com.example.recipeapp.Repositories.ReviewRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.MessageService;
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
    private final ReviewRepository reviewRepository;
    private final RecipeService recipeService;
    private final UserService userService;

    @Autowired
    public ReviewController(ReviewService reviewService, ReviewRepository reviewRepository, RecipeService recipeService, UserService userService) {
        this.reviewService = reviewService;
        this.reviewRepository = reviewRepository;
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

    @DeleteMapping("/deleteReview/{recipeId}/{reviewId}")
    public ResponseEntity<Review> deleteReview(@PathVariable("recipeId") Long recipeId,
                                               @PathVariable("reviewId") Long reviewId){
        reviewService.deleteReview(recipeId, reviewId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
