package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Notification.Notification;
import com.example.recipeapp.Model.Recipe;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Optional<Notification> findNotificationById(Long id);
    boolean existsBySenderAndReceiver(User sender, User receiver);

    @Query(value = "SELECT * FROM notifications n WHERE n.receiver_id = :userId", nativeQuery = true)
    List<Notification> findNotificationsByUserId(long userId);

}
