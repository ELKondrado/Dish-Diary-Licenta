package com.example.recipeapp.Services;

import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Notification.NotificationStatus;
import com.example.recipeapp.Model.Notification.NotificationType;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.Optional;

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
        Optional<Notification> optionalNotification = notificationRepository.findNotificationBySenderIdReceiverId(userSender.getUserId(), userReceiver.getUserId());
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            if(notification.getStatus()==NotificationStatus.PENDING) {
                return -1;
            }
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
        Optional<Notification> optionalNotification = notificationRepository.findNotificationBySenderIdReceiverId(
                notification.getReceiver().getUserId(),
                notification.getSender().getUserId()
        );
        if(optionalNotification.isPresent()) {
            Notification notificationReversed = optionalNotification.get();
            notificationReversed.setStatus(NotificationStatus.ACCEPTED);
        }
        notification.setStatus(NotificationStatus.ACCEPTED);
        notificationRepository.save(notification);
    }

    public void rejectFriendRequest(Notification notification){
        notification.setStatus(NotificationStatus.REJECTED);
        notificationRepository.save(notification);
    }

    @Transactional
    public void addFriend(User user, User friend) {
        if (!user.equals(friend)) {
            if (user.getFriendships().stream().noneMatch(friendship -> friendship.getFriend().equals(friend))) {
                Friendship userFriendship = new Friendship(user, friend);
                Friendship friendFriendship = new Friendship(friend, user);

                user.getFriendships().add(userFriendship);
                friend.getFriendships().add(friendFriendship);

                userRepository.save(user);
                userRepository.save(friend);
            } else {
                throw new IllegalStateException("Users are already friends.");
            }
        } else {
            throw new IllegalStateException("Cannot add yourself as a friend.");
        }
    }
}
