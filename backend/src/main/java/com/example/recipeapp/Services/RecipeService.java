package com.example.recipeapp.Services;

import com.example.recipeapp.Dtos.RecipeUpdateDto;
import com.example.recipeapp.Exceptions.*;
import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.Recipe.RecipeTag;
import com.example.recipeapp.Model.Repository;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RecipeRepository;
import com.example.recipeapp.Repositories.RepositoryRepository;
import com.example.recipeapp.Repositories.ReviewRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RepositoryRepository repositoryRepository;


    @Autowired
    public RecipeService(RecipeRepository recipeRepository, UserRepository userRepository, RepositoryRepository repositoryRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.repositoryRepository = repositoryRepository;
    }

    public List<Recipe> getAllRecipes(){
        return recipeRepository.findAll();
    }

    public Recipe findRecipeById(Long id) {
        return recipeRepository.findRecipeById(id).orElseThrow(() -> new NotFound("Recipe by id " + id + " was not found"));
    }

    public List<Recipe> getCreatedRecipes(long userId){
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return getRecipesByOwner(user.getUserId());
        } else {
            throw new NotFound("User with id " + userId + " not found in getting created recipes");
        }
    }

    public void deleteRecipe(Long recipeId) {
        boolean exists = recipeRepository.existsById(recipeId);
        if(!exists){
            throw new NotFound("Recipe with id: " + recipeId + " does not exist");
        }
        recipeRepository.deleteById(recipeId);
    }

    public Recipe updateRecipe(RecipeUpdateDto recipeUpdateDto, long userId){
        Optional<Recipe> optionalRecipe = recipeRepository.findRecipeById(recipeUpdateDto.getId());
        if(optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();

            Optional<User> optionalUser = userRepository.findUserByUserId(userId);
            if(optionalUser.isPresent()) {
                User user = optionalUser.get();

                if (user.getUserId() == recipe.getUserOwner().getUserId())
                {
                    recipe.setName(recipeUpdateDto.getName());
                    recipe.setIngredients(recipeUpdateDto.getIngredients());
                    recipe.setStepsOfPreparation(recipeUpdateDto.getStepsOfPreparation());
                    return recipeRepository.save(recipe);
                }
                else {
                    throw new NotFound("User with id " + userId + " is not the user owner of the recipe");
                }
            } else{
                throw new NotFound("User with id " + userId + " not found in updating recipe");
            }
        } else{
            throw new NotFound("Recipe with id " + recipeUpdateDto.getId() + " not found in updating recipe");
        }
    }

    @Transactional
    public Recipe createNewRecipeInRepository(Recipe recipe, long repositoryId){
        Optional<Repository> optionalRepository = repositoryRepository.findRepositoryById(repositoryId);
        if (optionalRepository.isPresent()) {
            Repository repository = optionalRepository.get();

            checkRecipeAttributes(recipe);

            recipe.setUserOwner(repository.getUserOwner());
            recipe.getUserOwner().setTotalRecipes(recipe.getUserOwner().getTotalRecipes() + 1);
            recipe.getUserOwner().setTotalRecipesCreated(recipe.getUserOwner().getTotalRecipesCreated() + 1);
            recipe.setDateCreated(new Date());
            recipe.getRepositories().add(repository);

            repository.getRecipes().add(recipe);

            return recipeRepository.save(recipe);
        } else {
            throw new NotFound("Repository with id " + repositoryId + " not found");
        }
    }

    @Transactional
    public boolean addRecipeToRepository(long recipeId, long repositoryId) {
        Optional<Recipe> optionalRecipe = recipeRepository.findRecipeById(recipeId);
        if (optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();

            Optional<Repository> optionalRepository = repositoryRepository.findRepositoryById(repositoryId);
            if (optionalRepository.isPresent()) {
                Repository repository = optionalRepository.get();

                if(!repository.getRecipes().contains(recipe)) {
                    repository.getRecipes().add(recipe);
                    repository.getUserOwner().setTotalRecipes(repository.getUserOwner().getTotalRecipes() + 1);
                    repository.getUserOwner().setTotalRecipesAdded(repository.getUserOwner().getTotalRecipesAdded() + 1);
                    recipe.getRepositories().add(repository);
                    userRepository.save(repository.getUserOwner());
                    return true;
                }
                else{
                    return false;
                }
            } else {
                throw new NotFound("Repository with id " + repositoryId + " not found");
            }

        } else {
            throw new NotFound("Recipe with id " + recipeId + " not found");
        }
    }

    @Transactional
    public void deleteRecipeFromRepository(long recipeId, long repositoryId) {
        Optional<Recipe> optionalRecipe = recipeRepository.findRecipeById(recipeId);
        if (optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();

            Optional<Repository> optionalRepository = repositoryRepository.findRepositoryById(repositoryId);
            if (optionalRepository.isPresent()) {
                Repository repository = optionalRepository.get();

                repository.getRecipes().remove(recipe);
                recipe.getRepositories().remove(repository);
                repositoryRepository.save(repository);
                recipeRepository.save(recipe);
            } else {
                throw new NotFound("Repository with id " + repositoryId + " not found");
            }
        } else {
            throw new NotFound("Recipe with id " + recipeId + " not found");
        }
    }

    public List<Recipe> getRecipesFromRepository(long repositoryId) {
        Optional<Repository> optionalRepository = repositoryRepository.findRepositoryById(repositoryId);
        if (optionalRepository.isPresent()) {
            Repository repository = optionalRepository.get();

            return recipeRepository.findByRepositories_id(repository.getId());
        } else {
            throw new NotFound("Repository with id " + repositoryId + " not found");
        }
    }

    public Recipe getRecipeById(long recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new NotFound("Recipe with id: " + recipeId + " does not exist"));
    }

    public List<Recipe> getRecipesByOwner(Long userId) {
        return recipeRepository.findRecipesByOwner(userId);
    }

    @Transactional
    public void addRecipeImage(Recipe recipe, MultipartFile image) throws IOException {
        byte[] imageData = image.getBytes();
        recipe.setImage(imageData);
        recipeRepository.save(recipe);
    }

    public short addTag(Recipe recipe, String tag) {
        if(isValidRecipeTag(tag)) {
            if(!recipe.getTags().contains(RecipeTag.valueOf(tag))) {
                recipe.getTags().add(RecipeTag.valueOf(tag));
                recipeRepository.save(recipe);
                return 0;
            }
            else return -1;
        }
        else return -2;
    }

    public short deleteTag(Recipe recipe, String tag) {
        if(isValidRecipeTag(tag)) {
            if(recipe.getTags().contains(RecipeTag.valueOf(tag))) {
                recipe.getTags().remove(RecipeTag.valueOf(tag));
                recipeRepository.save(recipe);
                return 0;
            }
            else return -1;
        }
        else return -2;
    }



    // Private Methods

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

    private static boolean isValidRecipeTag(String tag) {
        try {
            RecipeTag.valueOf(tag);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    // End Private Methods
}
