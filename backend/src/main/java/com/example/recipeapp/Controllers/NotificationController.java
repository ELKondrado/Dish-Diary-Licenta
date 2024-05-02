package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.NotificationService;
import com.example.recipeapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/user/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationController(NotificationService notificationService, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping(value = "/getNotifications/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Notification> notifications = notificationService.getNotifications(user);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "getNotificationsCount/{userId}")
    public ResponseEntity<Long> getNotificationsCount(@PathVariable("userId") Long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Long notificationsCount = notificationService.getNotificationsCount(user);
            return new ResponseEntity<>(notificationsCount, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/rejectRecipeShare/{notificationId}")
    public ResponseEntity<Notification> rejectRecipeShare(@PathVariable long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);

        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notificationService.rejectRecipeShare(notification);
            return new ResponseEntity<>(notification, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/acceptRecipeShare/{notificationId}")
    public ResponseEntity<Notification> acceptRecipeShare(@PathVariable long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);

        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notificationService.acceptRecipeShare(notification);
            return new ResponseEntity<>(notification, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
