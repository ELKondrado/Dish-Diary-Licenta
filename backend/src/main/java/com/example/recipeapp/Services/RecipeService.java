package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.*;
import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RecipeRepository;
import com.example.recipeapp.Repositories.ReviewRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @PersistenceContext
    private EntityManager em;
    @Autowired
    public RecipeService(RecipeRepository recipeRepository, UserRepository userRepository, UserService userService, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.userService = userService;
        this.reviewRepository = reviewRepository;
    }

    private void checkRecipeAttributes(Recipe recipe) {
        if(recipe.getName() == null) {
            throw new IllegalStateException("Name does not exist!");
        }
        if(recipe.getIngredients() == null) {
            throw new IllegalStateException("Ingredients do not exist!");
        }
        if(recipe.getStepsOfPreparation() == null) {
            throw new IllegalStateException("Steps of preparation do not exist!");
        }
    }

    private void checkReviewAttributes(Review review) {
        if(review.getUserReviewText() == null) {
            throw new IllegalStateException("Review Text does not exist!");
        }
        if(review.getUserName() == null) {
            throw new IllegalStateException("Review username does not exist!");
        }
        if(review.getUserStarRating() == null) {
            throw new IllegalStateException("Review Start Rating does not exist!");
        }
    }

    public List<Recipe> getRecipes(){
        return recipeRepository.findAll();
    }

    public List<Review> getReviewsForRecipe(long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with id: " + recipeId + " does not exist"));

        return reviewRepository.findReviewsByRecipeId(recipe.getId());
    }

    public Recipe findRecipeById(Long id) {
        return recipeRepository.findRecipeById(id).orElseThrow(() -> new RecipeNotFoundException("Recipe by id " + id + " was not found"));
    }

    public Recipe addNewRecipe(Recipe recipe) {
        checkRecipeAttributes(recipe);
        return recipeRepository.save(recipe);
    }

    public Recipe addNewRecipe(Recipe recipe, User user) {
        checkRecipeAttributes(recipe);
        user.setTotalRecipes(user.getTotalRecipes() + 1);
        user.setTotalRecipesCreated(user.getTotalRecipesCreated() + 1);
        recipe.setUserOwner(user);
        user.getRecipes().add(recipe);
        recipe.getUsers().add(user);
        return recipeRepository.save(recipe);
    }

    @Transactional
    public boolean addUserRecipe(Recipe recipe, User user) {
        checkRecipeAttributes(recipe);
        if(!userService.doesUserHaveRecipe(user, recipe)) {
            user.setTotalRecipes( user.getTotalRecipes() + 1);
            user.setTotalRecipesAdded( user.getTotalRecipesAdded() + 1);
            user.getRecipes().add(em.merge(recipe));
            recipe.getUsers().add(user);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void deleteRecipe(Long recipeId) {
        boolean exists = recipeRepository.existsById(recipeId);
        if(!exists){
            throw new RecipeNotFoundException("Recipe with id: " + recipeId + " does not exist");
        }
        recipeRepository.deleteById(recipeId);
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

    @Transactional
    public Recipe updateRecipeName(Recipe recipe, String name) {
        if(name != null && name.length() > 0 && !Objects.equals(recipe.getName(), name)){
            recipe.setName(name);
        }
        else {
            throw new RecipeNameNotFoundException("Name not found!");
        }
        return recipe;
    }

    @Transactional
    public Recipe updateRecipeIngredients(Recipe recipe, String ingredients) {
        if(ingredients != null && ingredients.length() > 0 && !Objects.equals(recipe.getIngredients(), ingredients)){
            recipe.setIngredients(ingredients);
        }
        else {
            throw new RecipeIngredientsNotFoundException("Ingredients not found!");
        }
        return recipe;
    }

    @Transactional
    public Recipe updateRecipeStepsOfPreparation(Recipe recipe, String stepsOfPreparation) {
        if(stepsOfPreparation != null && stepsOfPreparation.length() > 0 && !Objects.equals(recipe.getStepsOfPreparation(), stepsOfPreparation)){
            recipe.setStepsOfPreparation(stepsOfPreparation);
        }
        else {
            throw new RecipeStepsOfPreparationNotFoundException("StepsOfPreparation not found!");
        }
        return recipe;
    }

    public Recipe getRecipeById(long recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with id: " + recipeId + " does not exist"));
    }

    public List<Recipe> getUserRecipes(Long userId) {
        return recipeRepository.findByUsers_UserId(userId);
    }

    @Transactional
    public void addRecipeImage(Recipe recipe, MultipartFile image) throws IOException {
        byte[] imageData = image.getBytes();
        recipe.setImage(imageData);
        recipeRepository.save(recipe);
    }

    public List<Recipe> getRecipesByOwner(Long userId) {
        return recipeRepository.findRecipesByOwner(userId);
    }

    @Transactional
    public Review addReviewToRecipe(Review review, Recipe recipe, User user) {
        checkReviewAttributes(review);
        review.setUserOwner(user);
        recipe.getReviews().add(review);
        recipeRepository.save(recipe);
        return review;
    }
}
