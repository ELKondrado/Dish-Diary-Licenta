package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c " +
           "FROM Conversation c " +
           "WHERE ( c.user1.id = :user1Id AND c.user2.id = :user2Id ) OR ( c.user1.id = :user2Id AND c.user2.id = :user1Id )")
    Optional<Conversation> findByUser1AndUser2(long user1Id, long user2Id);

    @Query("SELECT c " +
           "FROM Conversation c " +
           "WHERE c.user1.id = :userId OR c.user2.id = :userId")
    List<Conversation> getConversationsForUser(long userId);
}