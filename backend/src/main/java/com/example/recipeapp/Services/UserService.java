package com.example.recipeapp.Services;

import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public UserService(UserRepository userRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public Optional<User> findUserByUserName(String username) {
        return userRepository.findUserByUserName(username);
    }

    public Optional<User> findUserByUserId(long userId) {
        return userRepository.findUserByUserId(userId);
    }

    public Optional<User> fetchUserDetails(String username) {
        return userRepository.findUserByUserName(username);
    }

    @Transactional
    public short updateUserNickname(User user, String nickname) {
        if(nickname != null && nickname.length() > 0){
            Optional<User> optionalUser = userRepository.findUserByUserNickname(nickname);
            if(optionalUser.isPresent()) {
                User newUser = optionalUser.get();
                if(user == newUser) {
                    return 0;
                }
                return -1;
            }
            user.setUserNickname(nickname);
            userRepository.save(user);
        }
        return 0;
    }

    @Transactional
    public User updateUserBio(User user, String bio) {
        if(bio != null && bio.length() > 0){
            user.setUserBio(bio);
        }
        return user;
    }

    public void deleteUserRecipe(User user, long recipeId) {
        userRepository.deleteUserRecipe(user.getUserId(), recipeId);
        user.setTotalRecipes( user.getTotalRecipes() - 1);
        userRepository.save(user);
    }

    public boolean doesUserHaveRecipe(User user, Recipe recipe) {
        return user.getRecipes().contains(recipe);
    }

    public List<User> getFriends(User user) {
        return user.getFriendships().stream()
                .map(Friendship::getFriend)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addProfileImage(User user, MultipartFile image) throws IOException {
        byte[] imageData = image.getBytes();
        user.setProfileImage(imageData);
        userRepository.save(user);
    }
}
