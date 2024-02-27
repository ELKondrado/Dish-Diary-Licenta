package com.example.recipeapp.Controllers;

import com.example.recipeapp.Exceptions.RecipeNotFoundException;
import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Services.RecipeService;
import com.example.recipeapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/recipe")
public class RecipeController {
    private final RecipeService recipeService;
    private final UserService userService;

    @Autowired
    public RecipeController(RecipeService recipeService, UserService userService) {
        this.recipeService = recipeService;
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Recipe>> getRecipes(){
        List<Recipe> recipes = recipeService.getRecipes();
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable("id") Long id){
        Recipe recipe = recipeService.findRecipeById(id);
        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }

    @GetMapping("/{username}/createdRecipes")
    public ResponseEntity<List<Recipe>> getCreatedRecipes(@PathVariable("username") String username){

        Optional<User> optionalUser = userService.fetchUserDetails(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Recipe> recipes = recipeService.getRecipesByOwner(user.getUserId());
            return new ResponseEntity<>(recipes, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Recipe> registerNewRecipe(@RequestBody Recipe recipe){
        Recipe newRecipe = recipeService.addNewRecipe(recipe);
        return new ResponseEntity<>(newRecipe, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{recipeId}")
    public ResponseEntity<Recipe> deleteRecipe(@PathVariable("recipeId") Long recipeId){
        recipeService.deleteRecipe(recipeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/update/{recipeId}")
    public ResponseEntity<Recipe> updateRecipe(
            @PathVariable("recipeId") long recipeId,
            @RequestBody Map<String, String> request) {

        Recipe recipe = recipeService.getRecipeById(recipeId);

        if (request.containsKey("name")) {
            recipe = recipeService.updateRecipeName(recipe, request.get("name"));
        }

        if (request.containsKey("ingredients")) {
            recipe = recipeService.updateRecipeIngredients(recipe, request.get("ingredients"));
        }

        if (request.containsKey("stepsOfPreparation")) {
            recipe = recipeService.updateRecipeStepsOfPreparation(recipe, request.get("stepsOfPreparation"));
        }

        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }

    @PostMapping("/addUserNewRecipe")
    public ResponseEntity<Recipe> registerNewRecipe(@RequestBody Recipe recipe,
                                                    @RequestParam("username") String username) {
        Optional<User> optionalUser = userService.findUserByUserName(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Recipe newRecipe = recipeService.addNewRecipe(recipe, user);

            return new ResponseEntity<>(newRecipe, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/addUserRecipe/{username}/{recipeId}")
    public ResponseEntity<Recipe> addUserRecipe(@PathVariable("username") String username,
                                                @PathVariable("recipeId") long recipeId) {
        Optional<User> optionalUser = userService.findUserByUserName(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Recipe recipe = recipeService.findRecipeById(recipeId);
            if(recipe != null)
            {
                if(recipeService.addUserRecipe(recipe, user)) {
                    return new ResponseEntity<>(recipe, HttpStatus.CREATED);
                }
                else{
                    return new ResponseEntity<>(null, HttpStatus.OK);
                }
            }
            throw new RecipeNotFoundException("Recipe not found in adding it to user recipes!");
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/recipes")
    public ResponseEntity<List<Recipe>> getUserRecipes(@PathVariable("userId") Long userId) {
        List<Recipe> recipes = recipeService.getUserRecipes(userId);
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @PostMapping(value = "/{recipeId}/uploadImage", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> uploadImage(@PathVariable("recipeId") Long recipeId,
                                              @RequestPart("image") MultipartFile image) throws IOException {
        Recipe recipe = recipeService.findRecipeById(recipeId);
        recipeService.addRecipeImage(recipe, image);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{recipeId}/image")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable("recipeId") Long recipeId) {
        Recipe recipe = recipeService.findRecipeById(recipeId);

        if (recipe.getImage() != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);

            return new ResponseEntity<>(recipe.getImage(), headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/addReviewToRecipe/{recipeId}/{username}")
    public ResponseEntity<Review> addReview(@RequestBody Review review,
                                            @PathVariable("recipeId") long recipeId,
                                            @PathVariable("username") String username){
        Optional<User> optionalUser = userService.findUserByUserName(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Recipe recipe = recipeService.findRecipeById(recipeId);
            Review newReview = recipeService.addReviewToRecipe(review, recipe, user);
            return new ResponseEntity<>(review, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getReviewsForRecipe/{recipeId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable("recipeId") long recipeId){
        List<Review> reviews = recipeService.getReviewsForRecipe(recipeId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @DeleteMapping("/deleteReview/{recipeId}/{reviewId}")
    public ResponseEntity<Review> deleteReview(@PathVariable("recipeId") Long recipeId,
                                               @PathVariable("reviewId") Long reviewId){
        recipeService.deleteReview(recipeId, reviewId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
