package com.example.recipeapp.Services;

import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findUserByUserName(String username) {
        return userRepository.findUserByUserName(username);
    }

    public Optional<User> fetchUserDetails(String username) {
        return userRepository.findUserByUserName(username);
    }

    public void deleteUserRecipe(long userId, long recipeId) {
        userRepository.deleteUserRecipe(userId, recipeId);
    }

    public boolean doesUserHaveRecipe(User user, Recipe recipe) {
        return user.getRecipes().contains(recipe);
    }

    @Transactional
    public void addProfileImage(User user, MultipartFile image) throws IOException {
        byte[] imageData = image.getBytes();
        user.setProfileImage(imageData);
        userRepository.save(user);
    }
}
