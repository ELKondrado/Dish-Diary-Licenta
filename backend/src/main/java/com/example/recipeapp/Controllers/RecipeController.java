package com.example.recipeapp.Controllers;

import com.example.recipeapp.Dtos.RecipeUpdateDto;
import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Services.NotificationService;
import com.example.recipeapp.Services.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/recipe")
public class RecipeController {
    private final RecipeService recipeService;
    private final NotificationService notificationService;

    @Autowired
    public RecipeController(RecipeService recipeService, NotificationService notificationService) {
        this.recipeService = recipeService;
        this.notificationService = notificationService;
    }

    @GetMapping("/getAllRecipes")
    public ResponseEntity<List<Recipe>> getAllRecipes(){
        List<Recipe> recipes = recipeService.getAllRecipes();
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @GetMapping("/findRecipe/{id}")
    public ResponseEntity<Recipe> findRecipeById(@PathVariable("id") Long id){
        Recipe recipe = recipeService.findRecipeById(id);
        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }

    @GetMapping("/createdRecipes/{userId}")
    public ResponseEntity<List<Recipe>> getCreatedRecipes(@PathVariable("userId") long userId){
        List<Recipe> createdRecipes = recipeService.getCreatedRecipes(userId);
        return new ResponseEntity<>(createdRecipes, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{recipeId}")
    public ResponseEntity<Recipe> deleteRecipe(@PathVariable("recipeId") Long recipeId){
        recipeService.deleteRecipe(recipeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/updateRecipe/{userId}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable("userId") long userId,
                                               @RequestBody RecipeUpdateDto recipeUpdateDto) {
        Recipe recipe = recipeService.updateRecipe(recipeUpdateDto, userId);
        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }

    @PostMapping("/createNewRecipeInRepository/{repositoryId}")
    public ResponseEntity<Recipe> createNewRecipeInRepository(@RequestBody Recipe recipe,
                                                              @PathVariable("repositoryId") long repositoryId) {
        recipeService.createNewRecipeInRepository(recipe, repositoryId);
        return new ResponseEntity<>(recipe, HttpStatus.CREATED);
    }

    @PostMapping("/addUserRecipe/{recipeId}/{repositoryId}")
    public ResponseEntity<Recipe> addUserRecipe(@PathVariable("recipeId") long recipeId,
                                                @PathVariable("repositoryId") long repositoryId) {
        Recipe recipe = recipeService.addRecipeToRepository(recipeId, repositoryId);
        if(recipe == null){
            return new ResponseEntity<>(HttpStatus.ALREADY_REPORTED);
        }
        else{
            return new ResponseEntity<>(recipe, HttpStatus.OK);
        }
    }

    @DeleteMapping("/deleteRecipeFromRepository/{recipeId}/{repositoryId}")
    public ResponseEntity<Recipe> deleteRecipeFromRepository(@PathVariable("recipeId") long recipeId,
                                                             @PathVariable("repositoryId") long repositoryId) {
        recipeService.deleteRecipeFromRepository(recipeId, repositoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getRecipesFromRepository/{repositoryId}")
    public ResponseEntity<List<Recipe>> getRecipesFromRepository(@PathVariable("repositoryId") long repositoryId) {
        List<Recipe> recipes = recipeService.getRecipesFromRepository(repositoryId);
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @GetMapping("/getUserTotalRecipes/{userId}")
    public ResponseEntity<List<Recipe>> getUserTotalRecipes(@PathVariable("userId") long userId) {
        List<Recipe> recipes = recipeService.getUserTotalRecipes(userId);
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @PostMapping("/share")
    public ResponseEntity<Notification> shareRecipe(@RequestParam long userId,
                                                    @RequestParam long recipeId,
                                                    @RequestParam long friendId) {
        Recipe recipe = recipeService.getRecipeById(recipeId);
        if (recipe != null) {
            Notification notification = notificationService.shareRecipeToFriend(userId, recipe, friendId);
            return new ResponseEntity<>(notification, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/addTag/{recipeId}")
    public ResponseEntity<Recipe> addTag(@PathVariable("recipeId") long recipeId,
                                         @RequestParam("tag") String tag) {
        Recipe recipe = recipeService.findRecipeById(recipeId);
        short response = recipeService.addTag(recipe, tag);
        return switch (response) {
            case 0 -> new ResponseEntity<>(recipe, HttpStatus.OK);
            case -1 -> new ResponseEntity<>(HttpStatus.ALREADY_REPORTED);
            default -> new ResponseEntity<>(HttpStatus.NOT_FOUND);
        };
    }

    @DeleteMapping("/deleteTag/{recipeId}")
    public ResponseEntity<Recipe> deleteTag(@PathVariable("recipeId") long recipeId,
                                            @RequestParam("tag") String tag) {
        Recipe recipe = recipeService.findRecipeById(recipeId);
        short response = recipeService.deleteTag(recipe, tag);
        return switch (response) {
            case 0 -> new ResponseEntity<>(recipe, HttpStatus.OK);
            default -> new ResponseEntity<>(HttpStatus.NOT_FOUND);
        };
    }

    @PostMapping(value = "/{recipeId}/uploadImage", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<byte[]> uploadImage(@PathVariable("recipeId") Long recipeId,
                                              @RequestPart("image") MultipartFile image) throws IOException {
        Recipe recipe = recipeService.findRecipeById(recipeId);
        recipeService.addRecipeImage(recipe, image);
        return new ResponseEntity<>(recipe.getImage(), HttpStatus.OK);
    }

    @GetMapping("/{recipeId}/getImage")
    public ResponseEntity<byte[]> getImage(@PathVariable("recipeId") Long recipeId) {
        byte[] image = recipeService.getImage(recipeId);
        return new ResponseEntity<>(image, HttpStatus.OK);
    }
}
