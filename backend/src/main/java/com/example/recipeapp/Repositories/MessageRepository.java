package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<Message> getMessages(@Param("userId") Long userId);

}