package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Conversation;
import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.ConversationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Autowired
    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    public Conversation getConversationBetweenUsers(long user1Id, long user2Id) {
        Optional<Conversation> optionalConversation = conversationRepository.findByUser1AndUser2(user1Id, user2Id);
        if(optionalConversation.isPresent()) {
            return optionalConversation.get();
        }
        return null;
    }

    public Conversation createConversation(long user1Id, long user2Id, Message message) {
        Optional<User> optionalUser1 = userRepository.findUserByUserId(user1Id);
        if (optionalUser1.isPresent()) {
            User user1 = optionalUser1.get();

            Optional<User> optionalUser2 = userRepository.findUserByUserId(user2Id);
            if (optionalUser2.isPresent()) {
                User user2 = optionalUser2.get();

                Conversation conversation = new Conversation();
                conversation.setUser1(user1);
                conversation.setUser2(user2);
                conversation.setLastMessage(message);
                return conversationRepository.save(conversation);
            } else {
                throw new NotFound("User with id " + user1Id + " not found in creating conversation");
            }
        } else {
            throw new NotFound("User with id " + user2Id + " not found in creating conversation");
        }
    }

    public List<Conversation> getConversations(long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return conversationRepository.getConversationsForUser(user.getUserId());
        } else {
            throw new NotFound("User with id " + userId + " not found in getting conversations");
        }
    }

    @Transactional
    @Modifying
    public Conversation saveLastMessage(Conversation conversation, Message message) {
        conversation.setLastMessage(message);
        return conversationRepository.save(conversation);
    }
}

