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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.Optional;

@Service
public class FriendsService extends AbstractWSService{
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public FriendsService(FriendshipRepository friendshipRepository, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public Short sendFriendRequest(long userSenderId, String receiverUserNickname){
        Optional<User> optionalUserSender = userRepository.findUserByUserId(userSenderId);
        if (optionalUserSender.isPresent()) {
            User userSender = optionalUserSender.get();

            Optional<User> optionalUserReceiver = userRepository.findUserByUserNickname(receiverUserNickname);
            if (optionalUserReceiver.isPresent()) {
                User userReceiver = optionalUserReceiver.get();

                Optional<Notification> optionalNotification = notificationRepository.findNotificationBySenderIdReceiverId(userSender.getUserId(), userReceiver.getUserId());
                if (optionalNotification.isPresent()) {
                    Notification notification = optionalNotification.get();
                    if (notification.getStatus() == NotificationStatus.PENDING) {
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
                notifyFrontend();
                return 0;

            } else {
                throw new NotFound("User sender with id " + userSenderId + " not found in sending friend request");
            }
        } else {
            throw new NotFound("User receiver with nickname " + receiverUserNickname + " not found in sending friend request");
        }
    }

    public Notification acceptFriendRequest(long notificationId){
        Optional<Notification> optionalNotification = notificationRepository.findNotificationById(notificationId);

        if(optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();

            Optional<Notification> optionalNotificationUsers = notificationRepository.findNotificationBySenderIdReceiverId(
                    notification.getReceiver().getUserId(),
                    notification.getSender().getUserId());
            if(optionalNotificationUsers.isPresent()) {
                Notification notificationReversed = optionalNotification.get();
                notificationReversed.setStatus(NotificationStatus.ACCEPTED);
            }
            notification.setStatus(NotificationStatus.ACCEPTED);
            notificationRepository.save(notification);
            notifyFrontend();
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
            notifyFrontend();
            return notification;
        } else {
            throw new NotFound("Notification with id " + notificationId + " not found in rejecting friend request");
        }
    }

    @Transactional
    public Friendship addFriend(long userId, long friendId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            Optional<User> optionalFriend = userRepository.findUserByUserId(friendId);
            if (optionalFriend.isPresent()) {
                User friend = optionalFriend.get();

                if (!user.equals(friend)) {
                    if (user.getFriendships().stream().noneMatch(friendship -> friendship.getFriend().equals(friend))) {
                        Friendship userFriendship = new Friendship(user, friend);
                        Friendship friendFriendship = new Friendship(friend, user);

                        user.getFriendships().add(userFriendship);
                        friend.getFriendships().add(friendFriendship);

                        userRepository.save(user);
                        userRepository.save(friend);
                        notifyFrontend();
                        return userFriendship;
                    } else {
                        throw new IllegalStateException("Users are already friends.");
                    }
                } else {
                    throw new IllegalStateException("Cannot add yourself as a friend.");
                }

            } else {
                throw new NotFound("User with id " + userId + " not found in adding the friend");
            }
        } else {
            throw new NotFound("Friend with id " + friendId + " not found in adding the friend");
        }
    }

    @Transactional
    public void removeFriend(long userId, long removedFriendId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();

            Optional<User> optionalRemovedFriendUser = userRepository.findUserByUserId(removedFriendId);
            if(optionalRemovedFriendUser.isPresent()) {
                User removedFriend = optionalRemovedFriendUser.get();

                friendshipRepository.deleteFriendship(user.getUserId(), removedFriend.getUserId());
                notifyFrontend();
            }
            else {
                throw new NotFound("User with id " + userId + " not found in removing friend");
            }
        }
        else {
            throw new NotFound("Friend to be removed with id " + removedFriendId + " not found in removing friend");
        }
    }

    @Override
    protected String getEntityTopic() {
        return "notification";
    }
}
