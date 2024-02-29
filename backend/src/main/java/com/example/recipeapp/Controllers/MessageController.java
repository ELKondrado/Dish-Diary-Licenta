package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Conversation;
import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.MessageRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.ConversationService;
import com.example.recipeapp.Services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/user/chat")
public class MessageController {
    private final MessageService messageService;
    private final ConversationService conversationService;
    private final UserRepository userRepository;

    @Autowired
    public MessageController(MessageService messageService, ConversationService conversationService, UserRepository userRepository) {
        this.messageService = messageService;
        this.conversationService = conversationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/sendMessage/{senderId}/{receiverId}")
    public ResponseEntity<Message> sendMessage(@RequestBody String content,
                                               @PathVariable("senderId") long senderId,
                                               @PathVariable("receiverId") long receiverId){
        Optional<User> optionalSender = userRepository.findUserByUserId(senderId);
        if (optionalSender.isPresent()) {
            User sender = optionalSender.get();
            Optional<User> optionalReceiver = userRepository.findUserByUserId(receiverId);
            if (optionalReceiver.isPresent()) {
                User receiver = optionalReceiver.get();
                Message message = messageService.sendMessage(sender, receiver, content);

                Conversation conversationBetweenUsers = conversationService.getConversationBetweenUsers(sender, receiver);
                if(conversationBetweenUsers == null){
                    conversationService.createConversation(sender, receiver, message);
                }
                else {
                    conversationService.saveLastMessage(conversationBetweenUsers, message);
                }
                return new ResponseEntity<>(message, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getMessages")
    public ResponseEntity<List<Message>> getMessages(@RequestParam("userId") Long userId,
                                                     @RequestParam("page") Integer page,
                                                     @RequestParam("pageSize") Integer pageSize){
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Page<Message> messagePage = messageService.getMessages(user, page, pageSize);
            List<Message> messages = messagePage.getContent();
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getMessagesFromUser/{user1Id}/{user2Id}")
    public ResponseEntity<List<Message>> getMessagesFromUser(@PathVariable("user1Id") long user1Id,
                                                             @PathVariable("user2Id") long user2Id){
        Optional<User> optionalUser1 = userRepository.findUserByUserId(user1Id);
        if (optionalUser1.isPresent()) {
            User user1 = optionalUser1.get();
            Optional<User> optionalUser2 = userRepository.findUserByUserId(user2Id);
            if (optionalUser2.isPresent()) {
                User user2 = optionalUser2.get();
                List<Message> messagesFromUser = messageService.getMessagesFromUser(user1, user2);
                return new ResponseEntity<>(messagesFromUser, HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/setWasSeenConversation/{senderId}/{receiverId}")
    public ResponseEntity<Message> setWasSeenConversation(@PathVariable("senderId") long senderId,
                                                          @PathVariable("receiverId") long receiverId){
        Optional<User> optionalSender = userRepository.findUserByUserId(senderId);
        if (optionalSender.isPresent()) {
            User sender = optionalSender.get();
            Optional<User> optionalReceiver = userRepository.findUserByUserId(receiverId);
            if (optionalReceiver.isPresent()) {
                User receiver = optionalReceiver.get();
                messageService.setWasSeenConversation(sender, receiver);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getUnseenMessages/{userId}")
    public ResponseEntity<Integer> getUnseenMessages(@PathVariable("userId") long userId){
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Integer unseenConversations = messageService.getUnseenMessages(user);
            return new ResponseEntity<>(unseenConversations, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
