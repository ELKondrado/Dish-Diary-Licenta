package com.example.recipeapp.Controllers;

import com.example.recipeapp.Dtos.UserEditProfileDto;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/details/{username}")
    public ResponseEntity<User> getUserDetails(@PathVariable("username") String username){
        User user = userService.getUserDetails(username);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PutMapping("/editProfileAttributes/{userId}")
    public ResponseEntity<User> editProfileAttributes(@PathVariable("userId") long userId,
                                                      @RequestBody UserEditProfileDto userEditProfileDto){
        User user = userService.editProfileAttributes(userId, userEditProfileDto);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/deleteUserRecipe/{userId}/{recipeId}")
    public ResponseEntity<User> deleteUserRecipe(@PathVariable("userId") long userId,
                                                 @PathVariable("recipeId") long recipeId) {
        userService.deleteUserRecipe(userId, recipeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/getFriends/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable("userId") Long userId) {
        List<User> userFriends = userService.getFriends(userId);
        return new ResponseEntity<>(userFriends, HttpStatus.OK);
    }

    @PostMapping(value = "/{userId}/uploadImage", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<byte[]> uploadImage(@PathVariable("userId") Long userId,
                                              @RequestPart("image") MultipartFile image) throws IOException {
        byte[] profileImage = userService.addProfileImage(userId, image);
        return new ResponseEntity<>(profileImage, HttpStatus.OK);
    }

    @GetMapping("/{userId}/profileImage")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable("userId") Long userId) {
        byte[] profileImage = userService.getProfileImage(userId);
        return new ResponseEntity<>(profileImage, HttpStatus.OK);
    }
}
