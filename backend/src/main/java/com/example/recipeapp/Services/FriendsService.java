package com.example.recipeapp.Services;

import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Notification.NotificationStatus;
import com.example.recipeapp.Model.Notification.NotificationType;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class FriendsService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public FriendsService(UserRepository userRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public Short sendFriendRequest(User userSender, User userReceiver){
        if (notificationRepository.existsBySenderAndReceiver(userSender, userReceiver)) {
            return -1;
        }
        if (!userSender.equals(userReceiver)) {
            if (userSender.getFriendships().stream().anyMatch(friendship -> friendship.getFriend().equals(userReceiver))) {
                return -2;
            }

        } else {
            return -3;
        }

        Notification notification = new Notification();
        notification.setSender(userSender);
        notification.setReceiver(userReceiver);
        notification.setType(NotificationType.FRIEND_REQUEST);
        notification.setStatus(NotificationStatus.PENDING);
        notification.setDateCreated(new Date());
        notificationRepository.save(notification);
        return 0;
    }

    public void acceptFriendRequest(Notification notification){
        notification.setStatus(NotificationStatus.ACCEPTED);
        notificationRepository.save(notification);
    }

    public void rejectFriendRequest(Notification notification){
        notification.setStatus(NotificationStatus.REJECTED);
        notificationRepository.save(notification);
    }
}
