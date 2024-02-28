package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.FriendsService;
import com.example.recipeapp.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/user/friends")
public class FriendsController {
    private final FriendsService friendsService;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public FriendsController(FriendsService friendsService, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.friendsService = friendsService;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping("/sendFriendRequest/{userSenderId}/{receiverUserNickname}")
    public ResponseEntity<Map<String, String>> sendFriendRequest(
            @PathVariable Long userSenderId,
            @PathVariable String receiverUserNickname) {

        Map<String, String> response = new HashMap<>();

        Optional<User> optionalUserSender = userRepository.findUserByUserId(userSenderId);

        if (optionalUserSender.isPresent()) {
            User userSender = optionalUserSender.get();

            Optional<User> optionalUserReceiver = userRepository.findUserByUserNickname(receiverUserNickname);
            if (optionalUserReceiver.isPresent()) {
                User userReceiver = optionalUserReceiver.get();
                Short status = friendsService.sendFriendRequest(userSender, userReceiver);
                if(status == 0) {
                    response.put("status", "SUCCESS");
                }
                else if(status == -1) {
                    response.put("status", "FRIEND REQUEST ALREADY SENT");
                }
                else if(status == -2) {
                    response.put("status", "RECEIVER ALREADY FRIEND");
                }
                else if(status == -3) {
                    response.put("status", "CANNOT ADD YOURSELF");
                }
            } else {
                response.put("status", "USER RECEIVER NOT FOUND");
            }
        } else {
            response.put("status", "SENDER NOT FOUND");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/acceptFriendRequest/{notificationId}")
    public ResponseEntity<Notification> acceptFriendRequest(@PathVariable Long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);

        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            friendsService.acceptFriendRequest(notification);
            //addFriend(notification.getSender().getUserId(), notification.getReceiver().getUserId());
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/rejectFriendRequest/{notificationId}")
    public ResponseEntity<Notification> rejectFriendRequest(@PathVariable Long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);

        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            friendsService.rejectFriendRequest(notification);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
