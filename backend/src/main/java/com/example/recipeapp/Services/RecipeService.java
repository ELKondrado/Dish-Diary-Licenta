package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.RecipeIngredientsNotFoundException;
import com.example.recipeapp.Exceptions.RecipeNameNotFoundException;
import com.example.recipeapp.Exceptions.RecipeNotFoundException;
import com.example.recipeapp.Exceptions.RecipeStepsOfPreparationNotFoundException;
import com.example.recipeapp.Model.Recipe;
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

    @GetMapping
    public List<Recipe> getRecipes(){
        return recipeRepository.findAll();
    }

    public Recipe findRecipeById(Long id) {
        return recipeRepository.findRecipeById(id).orElseThrow(() -> new RecipeNotFoundException("Recipe by id " + id + " was not found"));
    }

    public Recipe addNewRecipe(Recipe recipe) {
        if(recipe.getName().length() == 0 || recipe.getName() == null) {
            throw new IllegalStateException("Name does not exist!");
        }
        if(recipe.getIngredients().length() == 0 || recipe.getIngredients() == null) {
            throw new IllegalStateException("Ingredients do not exist!");
        }
        if(recipe.getStepsOfPreparation().length() == 0 || recipe.getStepsOfPreparation() == null) {
            throw new IllegalStateException("Steps of preparation do not exist!");
        }
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
    public Recipe updateRecipeName(long recipeId, String name) {
        Recipe recipe = getRecipeById(recipeId);
        if(name != null && name.length() > 0 && !Objects.equals(recipe.getName(), name)){
            recipe.setName(name);
        }
        else {
            throw new RecipeNameNotFoundException("Name not found!");
        }
        return recipe;
    }

    @Transactional
    public Recipe updateRecipeIngredients(long recipeId, String ingredients) {
        Recipe recipe = getRecipeById(recipeId);
        if(ingredients != null && ingredients.length() > 0 && !Objects.equals(recipe.getIngredients(), ingredients)){
            recipe.setIngredients(ingredients);
        }
        else {
            throw new RecipeIngredientsNotFoundException("Name not found!");
        }
        return recipe;
    }

    @Transactional
    public Recipe updateRecipeStepsOfPreparation(long recipeId, String stepsOfPreparation) {
        Recipe recipe = getRecipeById(recipeId);
        if(stepsOfPreparation != null && stepsOfPreparation.length() > 0 && !Objects.equals(recipe.getStepsOfPreparation(), stepsOfPreparation)){
            recipe.setStepsOfPreparation(stepsOfPreparation);
        }
        else {
            throw new RecipeStepsOfPreparationNotFoundException("Name not found!");
        }
        return recipe;
    }

    private Recipe getRecipeById(long recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with id: " + recipeId + " does not exist"));
    }
}
