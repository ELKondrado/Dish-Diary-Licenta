package com.example.recipeapp.User;

import com.example.recipeapp.Exception.UserNotFoundException;
import com.example.recipeapp.Recipe.Recipe;
import com.example.recipeapp.Recipe.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User findUserByUserId(Long id) {
        return userRepository.findUserByUserId(id).orElseThrow(() -> new UserNotFoundException("User by id " + id + " was not found"));
    }

    public User addNewUser(User user) {
        Optional<User> userOptional = userRepository.findUserByUserEmail(user.getUserEmail());
        if(userOptional.isPresent()){
            throw new IllegalStateException("Email taken!");
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        boolean exists = userRepository.existsById(userId);
        if(!exists){
            throw new UserNotFoundException("User with id: " + userId + " does not exist");
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public User updateUserName(long userId, String name) {
        User user = getUser(userId);
        if(name != null && name.length() > 0 && !Objects.equals(user.getUserName(), name)){
            user.setUserName(name);
        }
        return user;
    }

    @Transactional
    public User updateUserEmail(long userId, String email) {
        User user = getUser(userId);
        if(email != null && email.length() > 0 && !Objects.equals(user.getUserEmail(), email)){
            user.setUserEmail(email);
        }
        return user;
    }

    private User getUser(long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with id: " + userId + " does not exist"));
    }
}
