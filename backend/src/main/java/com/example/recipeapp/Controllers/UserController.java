package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.Notification.Notification;
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
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
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
    public ResponseEntity<List<User>> addFriend(@PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<User> userFriends = userService.getFriends(user);
            return new ResponseEntity<>(userFriends, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(value = "/addFriend/{userId}/{friendId}")
    public ResponseEntity<Friendship> addFriend(@PathVariable("userId") Long userId,
                                                @PathVariable("friendId") Long friendId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<User> optionalFriend = userRepository.findUserByUserId(friendId);
            if (optionalFriend.isPresent()) {
                User friend = optionalFriend.get();
                userService.addFriend(user, friend);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/sendFriendRequest/{userSenderId}/{receiverUserName}")
    public ResponseEntity<Notification> sendFriendRequest(@PathVariable Long userSenderId,
                                                    @PathVariable String receiverUserName) {
        Optional<User> optionalUserSender = userRepository.findUserByUserId(userSenderId);

        if(optionalUserSender.isPresent()) {
            User userSender = optionalUserSender.get();

            Optional<User> optionalUserReceiver = userRepository.findUserByUserName(receiverUserName);
            if(optionalUserReceiver.isPresent()) {
                User userReceiver = optionalUserReceiver.get();

                userService.sendFriendRequest(userSender, userReceiver);
            }
            else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/acceptFriendRequest/{notificationId}")
    public ResponseEntity<Notification> acceptFriendRequest(@PathVariable Long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);

        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            userService.acceptFriendRequest(notification);
            addFriend(notification.getSender().getUserId(), notification.getReceiver().getUserId());
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/rejectFriendRequest/{notificationId}")
    public ResponseEntity<Notification> rejectFriendRequest(@PathVariable Long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);

        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            userService.rejectFriendRequest(notification);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/getNotifications/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Notification> notifications = userService.getNotifications(user);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
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
