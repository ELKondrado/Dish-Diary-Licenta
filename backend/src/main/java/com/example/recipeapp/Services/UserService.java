package com.example.recipeapp.Services;

import com.example.recipeapp.Dtos.UserEditProfileDto;
import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.Repository;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findUserByUserId(long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if(optionalUser.isPresent()){
            return optionalUser.get();
        }
        else{
            throw new NotFound("User with id " + userId + " not found");
        }
    }

    public User findUserByNickname(String nickname) {
        Optional<User> optionalUser = userRepository.findByUserNickname(nickname);
        return optionalUser.orElse(null);
    }

    public User getUserDetails(String username) {
        Optional<User> optionalUser = userRepository.findUserByUserName(username);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new NotFound("User with username " + username + " not found in getting user details");
        }
    }

    public User getUserDetailsByNickname(String nickname) {
        Optional<User> optionalUser = userRepository.findByUserNickname(nickname);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new NotFound("User with nickname " + nickname + " not found in getting user details");
        }
    }

    public User editProfileAttributes(long userId, UserEditProfileDto userEditProfileDto) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();

            User optionalNicknameUser = findUserByNickname(userEditProfileDto.getUserNicknameToChange());
            if(optionalNicknameUser == null) {
                user.setUserNickname(userEditProfileDto.getUserNicknameToChange());
            }
            user.setUserBio(userEditProfileDto.getUserBioToChange());
            return userRepository.save(user);
        } else {
            throw new NotFound("User with id " + userId + " not found in editing profile");
        }
    }

    public void deleteUserRecipe(long userId, long recipeId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            userRepository.deleteUserRecipe(user.getUserId(), recipeId);
            user.setTotalRecipes( user.getTotalRecipes() - 1);
            userRepository.save(user);
        } else {
            throw new NotFound("User with id " + userId + " not found in deleting user's recipe");
        }
    }

    public List<User> getFriends(long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return user.getFriendships().stream()
                    .map(Friendship::getFriend)
                    .collect(Collectors.toList());
        } else {
            throw new NotFound("User with id " + userId + " not found in getting user friends");
        }

    }

    @Transactional
    public byte[] addProfileImage(long userId, MultipartFile image) throws IOException {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            byte[] imageData = image.getBytes();
            user.setProfileImage(imageData);
            userRepository.save(user);
            return user.getProfileImage();
        } else {
            throw new NotFound("User with id " + userId + " not found in uploading profile image");
        }
    }

    public byte[] getProfileImage(long userId){
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (user.getProfileImage() != null) {
                return user.getProfileImage();
            } else {
                throw new NotFound("Profile image not found");
            }
        }
        else {
            throw new NotFound("User with id " + userId + " not found in getting profile image");
        }
    }
}
