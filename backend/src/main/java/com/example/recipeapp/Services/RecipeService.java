package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.RecipeIngredientsNotFoundException;
import com.example.recipeapp.Exceptions.RecipeNameNotFoundException;
import com.example.recipeapp.Exceptions.RecipeNotFoundException;
import com.example.recipeapp.Exceptions.RecipeStepsOfPreparationNotFoundException;
import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    private void checkRecipeAttributes(Recipe recipe) {
        if(recipe.getName().length() == 0) {
            throw new IllegalStateException("Name does not exist!");
        }
        if(recipe.getIngredients().length() == 0) {
            throw new IllegalStateException("Ingredients do not exist!");
        }
        if(recipe.getStepsOfPreparation().length() == 0) {
            throw new IllegalStateException("Steps of preparation do not exist!");
        }
    }

    @GetMapping
    public List<Recipe> getRecipes(){
        return recipeRepository.findAll();
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
        user.getRecipes().add(recipe);
        recipe.getUsers().add(user);
        return recipeRepository.save(recipe);
    }

    public void deleteRecipe(Long recipeId) {
        boolean exists = recipeRepository.existsById(recipeId);
        if(!exists){
            throw new RecipeNotFoundException("Recipe with id: " + recipeId + " does not exist");
        }
        recipeRepository.deleteById(recipeId);
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
}
