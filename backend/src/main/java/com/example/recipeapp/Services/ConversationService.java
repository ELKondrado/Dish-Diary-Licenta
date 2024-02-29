package com.example.recipeapp.Services;

import com.example.recipeapp.Model.Conversation;
import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.ConversationRepository;
import com.example.recipeapp.Repositories.MessageRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;

    @Autowired
    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Conversation getConversationBetweenUsers(User user1, User user2) {
        Optional<Conversation> optionalConversation = conversationRepository.findByUser1AndUser2(user1.getUserId(), user2.getUserId());
        if(optionalConversation.isPresent()) {
            return optionalConversation.get();
        }
        return null;
    }

    public Conversation createConversation(User user1, User user2, Message message) {
        Conversation conversation = new Conversation();
        conversation.setUser1(user1);
        conversation.setUser2(user2);
        conversation.setLastMessage(message);
        return conversationRepository.save(conversation);
    }

    public List<Conversation> getConversations(User user) {
        return conversationRepository.getConversationsForUser(user.getUserId());
    }

    @Transactional
    @Modifying
    public Conversation saveLastMessage(Conversation conversation, Message message) {
        conversation.setLastMessage(message);
        return conversationRepository.save(conversation);
    }
}

