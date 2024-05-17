package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Notification.NotificationStatus;
import com.example.recipeapp.Model.Notification.NotificationType;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.FriendshipRepository;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.Optional;

@Service
public class FriendsService extends AbstractWSService{
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    @Autowired
    public FriendsService(FriendshipRepository friendshipRepository, UserRepository userRepository, NotificationRepository notificationRepository, UserService userService) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    public Short sendFriendRequest(long userSenderId, String receiverUserNickname) {
        User userSender = userService.findUserByUserId(userSenderId);
        User userReceiver = userService.findUserByNickname(receiverUserNickname);

        if (userReceiver == null) {
            return -1;
        }

        if (!userSender.equals(userReceiver)) {
            if (userSender.getFriendships().stream().anyMatch(friendship -> friendship.getFriend().equals(userReceiver))) {
                return -2;
            }
        } else {
            return -3;
        }

        Optional<Notification> optionalNotification1 = notificationRepository.findPendingFriendRequestBySenderIdReceiverId(userSender.getUserId(), userReceiver.getUserId());
        if (optionalNotification1.isPresent()) {
            return -4;
        }

        Optional<Notification> optionalNotification2 = notificationRepository.findPendingFriendRequestBySenderIdReceiverId(userReceiver.getUserId(), userSender.getUserId());
        if (optionalNotification2.isPresent()) {
            Notification notification = optionalNotification2.get();
            acceptFriendRequest(notification.getId());
            return 1;
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

    public Notification acceptFriendRequest(long notificationId){
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);

        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();

            Optional<Notification> optionalNotificationUsers = notificationRepository.findFriendRequestBySenderIdReceiverId(
                    notification.getReceiver().getUserId(),
                    notification.getSender().getUserId());
            if(optionalNotificationUsers.isPresent()) {
                Notification notificationReversed = optionalNotification.get();
                notificationReversed.setStatus(NotificationStatus.ACCEPTED);
            }
            notification.setStatus(NotificationStatus.ACCEPTED);
            notificationRepository.save(notification);
            addFriend(notification.getReceiver().getUserId(), notification.getSender().getUserId());
            return notification;
        } else {
            throw new NotFound("Notification with id " + notificationId + " not found in accepting friend request");
        }
    }

    public Notification rejectFriendRequest(long notificationId){
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);
        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();

            notification.setStatus(NotificationStatus.REJECTED);
            notificationRepository.save(notification);
            return notification;
        } else {
            throw new NotFound("Notification with id " + notificationId + " not found in rejecting friend request");
        }
    }

    @Transactional
    public Friendship addFriend(long userId, long friendId) {
        User user = userService.findUserByUserId(userId);
        User friend = userService.findUserByUserId(friendId);

        if (!user.equals(friend)) {
            if (user.getFriendships().stream().noneMatch(friendship -> friendship.getFriend().equals(friend))) {
                Friendship userFriendship = new Friendship(user, friend);
                Friendship friendFriendship = new Friendship(friend, user);

                user.getFriendships().add(userFriendship);
                friend.getFriendships().add(friendFriendship);

                userRepository.save(user);
                userRepository.save(friend);
                return userFriendship;
            } else {
                throw new IllegalStateException("Users are already friends.");
            }
        } else {
            throw new IllegalStateException("Cannot add yourself as a friend.");
        }
    }

    @Transactional
    public void removeFriend(long userId, long removedFriendId) {
        User user = userService.findUserByUserId(userId);
        User removedFriend = userService.findUserByUserId(removedFriendId);

        friendshipRepository.deleteFriendship(user.getUserId(), removedFriend.getUserId());
    }

    @Override
    protected String getEntityTopic() {
        return "notification";
    }
}
