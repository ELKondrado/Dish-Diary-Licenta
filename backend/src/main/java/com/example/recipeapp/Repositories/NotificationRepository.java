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
                   "WHERE n.sender_id = :senderId AND n.receiver_id = :receiverId", nativeQuery = true)
    Optional<Notification> findNotificationBySenderIdReceiverId(Long senderId, Long receiverId);
}
