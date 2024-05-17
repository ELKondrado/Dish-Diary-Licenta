package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Notification.NotificationStatus;
import com.example.recipeapp.Model.Notification.NotificationType;
import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService extends AbstractWSService{
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @Override
    protected String getEntityTopic() {
        return "notification";
    }

    public List<Notification> getNotifications(long userId) {
        User user = userService.findUserByUserId(userId);
        return notificationRepository.findNotificationsByUserId(user.getUserId());
    }

    public Long getNotificationsCount(long userId) {
        User user = userService.findUserByUserId(userId);
        return notificationRepository.getNotificationsCount(user.getUserId());
    }

    public Notification rejectRecipeShare(long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);
        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();

            notification.setStatus(NotificationStatus.REJECTED);
            return notificationRepository.save(notification);
        }
        else {
            throw new NotFound("Notification with id " + notificationId + " not found in rejecting recipe share");
        }
    }

    public Notification acceptRecipeShare(long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);
        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();

            notification.setStatus(NotificationStatus.ACCEPTED);
            return notificationRepository.save(notification);
        }
        else {
            throw new NotFound("Notification with id " + notificationId + " not found in accepting recipe share");
        }
    }

    public Notification shareRecipeToFriend(long userId, Recipe recipe, long friendId) {
        User user = userService.findUserByUserId(userId);
        User friend = userService.findUserByUserId(friendId);

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
