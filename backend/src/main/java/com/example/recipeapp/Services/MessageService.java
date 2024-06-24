package com.example.recipeapp.Services;

import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Conversation;
import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.User;
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
public class MessageService extends AbstractWSService{
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationService conversationService;

    @Autowired
    public MessageService(MessageRepository messageRepository, UserRepository userRepository, ConversationService conversationService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.conversationService = conversationService;
    }

    @Override
    protected String getEntityTopic() {
        return "message";
    }

    public Message sendMessage(long senderId, long receiverId, String content) {
        Optional<User> optionalSender = userRepository.findUserByUserId(senderId);
        if (optionalSender.isPresent()) {
            User sender = optionalSender.get();

            Optional<User> optionalReceiver = userRepository.findUserByUserId(receiverId);
            if (optionalReceiver.isPresent()) {
                User receiver = optionalReceiver.get();

                if (content != null && content.length() != 0){
                    Message message = new Message();
                    message.setSender(sender);
                    message.setReceiver(receiver);
                    message.setContent(content);
                    message.setTimestamp(new Date());
                    message.setWasSeen(false);
                    messageRepository.save(message);

                    Conversation conversationBetweenUsers = conversationService.getConversationBetweenUsers(sender.getUserId(), receiver.getUserId());
                    if(conversationBetweenUsers == null){
                        conversationService.createConversation(sender.getUserId(), receiver.getUserId(), message);
                    }
                    else {
                        conversationService.saveLastMessage(conversationBetweenUsers, message);
                    }

                    notifyFrontend();
                    return message;
                }
                else {
                    throw new IllegalStateException("Message content was not found!");
                }
            } else {
                throw new NotFound("Sender with id " + senderId + " not found in sending message");
            }
        } else {
            throw new NotFound("Receiver with id " + receiverId + " not found in sending message");
        }
    }

    public Page<Message> getMessages(long userId, Integer page, Integer pageSize) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("timestamp").descending());
            notifyFrontend();
            return messageRepository.findUserMessagesPaginated(user.getUserId(), pageable);
        } else {
            throw new NotFound("User with id " + userId + " not found in getting messages");
        }
    }

    public List<Message> getMessagesFromUser(long user1Id, long user2Id) {
        Optional<User> optionalUser1 = userRepository.findUserByUserId(user1Id);
        if (optionalUser1.isPresent()) {
            User user1 = optionalUser1.get();
            Optional<User> optionalUser2 = userRepository.findUserByUserId(user2Id);
            if (optionalUser2.isPresent()) {
                User user2 = optionalUser2.get();
                return messageRepository.findUserMessagesFromFriend(user1.getUserId(), user2.getUserId());
            }
            else {
                throw new NotFound("User with id " + user1Id + " not found in getting messages from user");
            }
        } else {
            throw new NotFound("User with id " + user2Id + " not found in getting messages from user");
        }
    }

    @Transactional
    @Modifying
    public void setWasSeenConversation(long user1Id, long user2Id) {
        Optional<User> optionalSender = userRepository.findUserByUserId(user1Id);
        if (optionalSender.isPresent()) {
            User sender = optionalSender.get();

            Optional<User> optionalReceiver = userRepository.findUserByUserId(user2Id);
            if (optionalReceiver.isPresent()) {
                User receiver = optionalReceiver.get();

                messageRepository.setWasSeenConversation(sender.getUserId(), receiver.getUserId());
            } else {
                throw new NotFound("User with id " + user1Id + " not found in setting seen conversation");
            }
        } else {
            throw new NotFound("User with id " + user2Id + " not found in setting seen conversation");
        }
    }

    public Integer getUnseenMessages(long userId) {
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return messageRepository.getUnseenMessages(user.getUserId());
        } else {
            throw new NotFound("User with id " + userId + " not found in getting unseen messages");
        }
    }
}
