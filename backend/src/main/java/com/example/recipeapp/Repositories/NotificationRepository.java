package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Optional<Notification> findNotificationById(Long id);

    @Query(value = "SELECT * " +
                   "FROM notifications n " +
                   "WHERE n.receiver_id = :userId", nativeQuery = true)
    List<Notification> findNotificationsByUserId(Long userId);

    @Query(value = "SELECT * " +
                   "FROM notifications n " +
                   "WHERE n.sender_id = :senderId AND n.receiver_id = :receiverId AND n.type = 'FRIEND_REQUEST'", nativeQuery = true)
    Optional<Notification> findFriendRequestBySenderIdReceiverId(Long senderId, Long receiverId);

    @Query(value = "SELECT * " +
            "FROM notifications n " +
            "WHERE ( n.sender_id = :senderId AND n.receiver_id = :receiverId ) AND ( n.type = 'FRIEND_REQUEST' AND n.status = 'PENDING' )", nativeQuery = true)
    Optional<Notification> findPendingFriendRequestBySenderIdReceiverId(Long senderId, Long receiverId);


    @Query(value = "SELECT count(*) " +
                   "FROM notifications n " +
                   "WHERE n.receiver_id = :userId AND ( n.status = 'PENDING' OR n.status = 'SHARED' )", nativeQuery = true)
    Long getNotificationsCount(Long userId);
}
