package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
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

    @PutMapping("/editProfileAttributes/{userId}")
    public ResponseEntity<Map<String, String>> getUserDetails(@PathVariable("userId") long userId,
                                               @RequestBody Map<String, String> request){
        Map<String, String> response = new HashMap<>();

        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if(userService.updateUserNickname(user, request.get("userNicknameToChange")) == -1) {
                response.put("status", "NICKNAME ALREADY USED");
            }
            else{
                user = userService.updateUserBio(user, request.get("userBioToChange"));
                userRepository.save(user);
                response.put("status", "SUCCESS");
            }
        } else {
            response.put("status", "USER NOT FOUND");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/deleteUserRecipe/{userId}/{recipeId}")
    public ResponseEntity<User> deleteUserRecipe(@PathVariable("userId") long userId,
                                                 @PathVariable("recipeId") long recipeId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            userService.deleteUserRecipe(user, recipeId);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/getFriends/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<User> userFriends = userService.getFriends(user);
            return new ResponseEntity<>(userFriends, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(value = "/{userId}/uploadImage", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> uploadImage(@PathVariable("userId") Long userId,
                                              @RequestPart("image") MultipartFile image) throws IOException {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            userService.addProfileImage(user, image);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{userId}/profileImage")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);

        if(optionalUser.isPresent())
        {
            User user = optionalUser.get();
            if (user.getProfileImage() != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG);

                return new ResponseEntity<>(user.getProfileImage(), headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
