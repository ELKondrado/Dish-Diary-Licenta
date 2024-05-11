package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Notification.NotificationStatus;
import com.example.recipeapp.Model.Notification.NotificationType;
import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService extends AbstractWSService{
    private final NotificationRepository notificationRepository;
    private final UserService userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserService userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected String getEntityTopic() {
        return "notification";
    }

    public List<Notification> getNotifications(long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return notificationRepository.findNotificationsByUserId(user.getUserId());
        } else {
            throw new NotFound("User with id " + userId + " not found in getting his notifications");
        }
    }

    public Long getNotificationsCount(long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return notificationRepository.getNotificationsCount(user.getUserId());
        } else {
            throw new NotFound("User with id " + userId + " not found in getting his notifications count");
        }
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
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();

            Optional<User> optionalFriend = userRepository.findUserByUserId(friendId);
            if (optionalFriend.isPresent()) {
                User friend = optionalFriend.get();

                Notification notification = new Notification();
                notification.setSender(user);
                notification.setReceiver(friend);
                notification.setType(NotificationType.RECIPE_SHARE);
                notification.setStatus(NotificationStatus.SHARED);
                notification.setDateCreated(new Date());
                notification.setSharedRecipe(recipe);
                return notificationRepository.save(notification);
            } else {
                throw new NotFound("Friend with id " + friendId + " not found in recipe share");
            }
        }
        else {
            throw new NotFound("User with id " + userId + " not found in recipe share");
        }
    }
}
