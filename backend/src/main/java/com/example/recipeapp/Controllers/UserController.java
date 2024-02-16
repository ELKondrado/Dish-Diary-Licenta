package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RecipeRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.RecipeService;
import com.example.recipeapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, RecipeRepository recipeRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
    }

    @GetMapping("/details/{username}")
    public ResponseEntity<User> getUserDetails(@PathVariable("username") String username){
        Optional<User> optionalUser = userService.fetchUserDetails(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deleteUserRecipe/{userId}/{recipeId}")
    public ResponseEntity<User> deleteUserRecipe(@PathVariable("userId") long userId, @PathVariable("recipeId") long recipeId) {
        userService.deleteUserRecipe(userId, recipeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
