package com.example.recipeapp.Services;

import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.MessageRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(UserRepository userRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    public Message sendMessage(User sender, User receiver, String content) {
        if (content != null && content.length() != 0){
            Message message = new Message();
            message.setSender(sender);
            message.setReceiver(receiver);
            message.setContent(content);
            message.setTimestamp(new Date());
            message.setWasSeen(false);
            return messageRepository.save(message);
        }
       else throw new IllegalStateException("Message content was not found!");
    }

    public List<Message> getMessages(User user) {
        return messageRepository.findUserMessages(user.getUserId());
    }

    public List<Message> getMessagesFromUser(User user1, User user2) {
        return messageRepository.findUserMessagesFromFriend(user1.getUserId(), user2.getUserId());
    }

    @Transactional
    @Modifying
    public void setWasSeenConversation(User user1, User user2) {
        messageRepository.setWasSeenConversation(user1.getUserId(), user2.getUserId());
    }

    public Integer getUnseenMessages(User user) {
        return messageRepository.getUnseenMessages(user.getUserId());
    }
}
