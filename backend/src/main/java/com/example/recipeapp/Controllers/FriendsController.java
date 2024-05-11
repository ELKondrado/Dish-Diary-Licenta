package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.FriendsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/user/friends")
public class FriendsController {
    private final FriendsService friendsService;

    @Autowired
    public FriendsController(FriendsService friendsService, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.friendsService = friendsService;
    }

    @PostMapping("/sendFriendRequest/{userSenderId}/{receiverUserNickname}")
    public ResponseEntity<Map<String, String>> sendFriendRequest(@PathVariable long userSenderId,
                                                                 @PathVariable String receiverUserNickname) {
        Map<String, String> response = new HashMap<>();
        Short status = friendsService.sendFriendRequest(userSenderId, receiverUserNickname);
        switch (status) {
            case  0 -> response.put("status", "SUCCESS");
            case -1 -> response.put("status", "FRIEND REQUEST ALREADY SENT");
            case -2 -> response.put("status", "RECEIVER ALREADY FRIEND");
            case -3 -> response.put("status", "CANNOT ADD YOURSELF");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/acceptFriendRequest/{notificationId}")
    public ResponseEntity<Notification> acceptFriendRequest(@PathVariable long notificationId) {
        Notification notification = friendsService.acceptFriendRequest(notificationId);
        addFriend(notification.getSender().getUserId(), notification.getReceiver().getUserId());
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }

    @PutMapping("/rejectFriendRequest/{notificationId}")
    public ResponseEntity<Notification> rejectFriendRequest(@PathVariable long notificationId) {
        Notification notification = friendsService.rejectFriendRequest(notificationId);
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }

    @PostMapping(value = "/addFriend/{userId}/{friendId}")
    public ResponseEntity<Friendship> addFriend(@PathVariable("userId") long userId,
                                                @PathVariable("friendId") long friendId) {
        Friendship friendship = friendsService.addFriend(userId, friendId);
        return new ResponseEntity<>(friendship, HttpStatus.OK);
    }

    @PutMapping(value = "/removeFriend/{userId}/{removedFriendId}")
    public ResponseEntity<Friendship> removeFriend(@PathVariable("userId") long userId,
                                                   @PathVariable("removedFriendId") long removedFriendId) {
        friendsService.removeFriend(userId, removedFriendId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
