package com.example.recipeapp.Services;

import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Notification.NotificationStatus;
import com.example.recipeapp.Model.Notification.NotificationType;
import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getNotifications(User user) {
        return notificationRepository.findNotificationsByUserId(user.getUserId());
    }

    public Notification shareRecipeToFriend(User user, Recipe recipe, User friend) {
        Notification notification = new Notification();
        notification.setSender(user);
        notification.setReceiver(friend);
        notification.setType(NotificationType.RECIPE_SHARE);
        notification.setStatus(NotificationStatus.SHARED);
        notification.setDateCreated(new Date());
        notification.setSharedRecipe(recipe);
        return notificationRepository.save(notification);
    }
}
