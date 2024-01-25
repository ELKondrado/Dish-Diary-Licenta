package com.example.recipeapp.Recipe;

import com.example.recipeapp.Exception.RecipeNotFoundException;
import com.example.recipeapp.User.User;
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
        Optional<Recipe> recipeOptional = recipeRepository.findRecipeByName(recipe.getName());
        if(recipeOptional.isPresent()){
            throw new IllegalStateException("Name taken");
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
        Recipe recipe = getRecipe(recipeId);
        if(name != null && name.length() > 0 && !Objects.equals(recipe.getName(), name)){
            recipe.setName(name);
        }
        return recipe;
    }

    @Transactional
    public Recipe updateRecipeIngredients(long recipeId, String ingredients) {
        Recipe recipe = getRecipe(recipeId);
        if(ingredients != null && ingredients.length() > 0 && !Objects.equals(recipe.getIngredients(), ingredients)){
            recipe.setIngredients(ingredients);
        }
        return recipe;
    }

    @Transactional
    public Recipe updateRecipeStepsOfPreparation(long recipeId, String stepsOfPreparation) {
        Recipe recipe = getRecipe(recipeId);
        if(stepsOfPreparation != null && stepsOfPreparation.length() > 0 && !Objects.equals(recipe.getStepsOfPreparation(), stepsOfPreparation)){
            recipe.setStepsOfPreparation(stepsOfPreparation);
        }
        return recipe;
    }

    private Recipe getRecipe(long recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with id: " + recipeId + " does not exist"));
    }
}
