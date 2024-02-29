package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m " +
           "FROM Message m " +
           "WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<Message> findUserMessages(@Param("userId") Long userId);

    @Query("SELECT m " +
           "FROM Message m " +
           "WHERE m.sender.userId = :userId OR m.receiver.userId = :userId ORDER BY m.timestamp DESC")
    Page<Message> findUserMessagesPaginated(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT m " +
           "FROM Message m " +
           "WHERE (m.sender.id = :user1Id AND m.receiver.id =:user2Id) OR (m.sender.id = :user2Id AND m.receiver.id = :user1Id)")
    List<Message> findUserMessagesFromFriend(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Transactional
    @Modifying
    @Query("UPDATE Message m " +
           "SET m.wasSeen = true " +
           "WHERE (m.sender.id = :user1Id AND m.receiver.id =:user2Id) OR (m.sender.id = :user2Id AND m.receiver.id = :user1Id)")
    void setWasSeenConversation(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Query("SELECT COUNT(DISTINCT CONCAT(m.sender.id, '_', m.receiver.id)) " +
           "FROM Message m " +
           "WHERE m.receiver.id = :userId " +
           "AND m.wasSeen = false")
    Integer getUnseenMessages(@Param("userId") Long userId);
}