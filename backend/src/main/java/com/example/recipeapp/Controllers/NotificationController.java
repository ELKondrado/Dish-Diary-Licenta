package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/user/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping(value = "/getNotifications/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable("userId") Long userId) {
        List<Notification> notifications = notificationService.getNotifications(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @GetMapping(value = "getNotificationsCount/{userId}")
    public ResponseEntity<Long> getNotificationsCount(@PathVariable("userId") Long userId) {
        Long notificationsCount = notificationService.getNotificationsCount(userId);
        return new ResponseEntity<>(notificationsCount, HttpStatus.OK);
    }

    @PutMapping("/rejectRecipeShare/{notificationId}")
    public ResponseEntity<Notification> rejectRecipeShare(@PathVariable long notificationId) {
        Notification notification = notificationService.rejectRecipeShare(notificationId);
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }

    @PutMapping("/acceptRecipeShare/{notificationId}")
    public ResponseEntity<Notification> acceptRecipeShare(@PathVariable long notificationId) {
        Notification notification = notificationService.acceptRecipeShare(notificationId);
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }
}
