package com.example.recipeapp.Services;

import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.MessageRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
