package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.FriendRequestException;
import com.example.recipeapp.Exceptions.NotificationNotFoundException;
import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Notification.NotificationStatus;
import com.example.recipeapp.Model.Notification.NotificationType;
import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public UserService(UserRepository userRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public Optional<User> findUserByUserName(String username) {
        return userRepository.findUserByUserName(username);
    }

    public Optional<User> fetchUserDetails(String username) {
        return userRepository.findUserByUserName(username);
    }

    public void deleteUserRecipe(User user, long recipeId) {
        userRepository.deleteUserRecipe(user.getUserId(), recipeId);
        user.setTotalRecipes( user.getTotalRecipes() - 1);
        userRepository.save(user);
    }

    public boolean doesUserHaveRecipe(User user, Recipe recipe) {
        return user.getRecipes().contains(recipe);
    }

    public List<User> getFriends(User user) {
        return user.getFriendships().stream()
                .map(Friendship::getFriend)
                .collect(Collectors.toList());
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

    public void sendFriendRequest(User userSender, User userReceiver){
        if (notificationRepository.existsBySenderAndReceiver(userSender, userReceiver)) {
            throw new FriendRequestException("Friend request already sent!");
        }
        if (!userSender.equals(userReceiver)) {

            if (userReceiver.getFriendships().stream().anyMatch(friendship -> friendship.getFriend().equals(userReceiver))) {
                throw new FriendRequestException("Users are already friends!");
            }
        } else {
            throw new FriendRequestException("Cannot add yourself as a friend!");
        }

        Notification notification = new Notification();
        notification.setSender(userSender);
        notification.setReceiver(userReceiver);
        notification.setType(NotificationType.FRIEND_REQUEST);
        notification.setStatus(NotificationStatus.PENDING);
        notification.setDateCreated(new Date());
        notificationRepository.save(notification);
    }

    public void acceptFriendRequest(Notification notification){
        notification.setStatus(NotificationStatus.ACCEPTED);
        notificationRepository.save(notification);
    }

    public void rejectFriendRequest(Notification notification){
        notification.setStatus(NotificationStatus.REJECTED);
        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(User user) {
        return notificationRepository.findNotificationsByUserId(user.getUserId());
    }

    @Transactional
    public void addProfileImage(User user, MultipartFile image) throws IOException {
        byte[] imageData = image.getBytes();
        user.setProfileImage(imageData);
        userRepository.save(user);
    }
}
