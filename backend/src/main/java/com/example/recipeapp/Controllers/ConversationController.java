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
@RequestMapping(path = "/user/conversation")
public class ConversationController {
    private final MessageService messageService;
    private final ConversationService conversationService;
    private final UserRepository userRepository;

    @Autowired
    public ConversationController(ConversationService conversationService, MessageService messageService, UserRepository userRepository) {
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.userRepository = userRepository;
    }

    @PostMapping("/createConversation/{user1Id}/{user2Id}")
    public ResponseEntity<Conversation> createConversation(@RequestBody Message message,
                                                           @PathVariable("user1Id") Long user1Id,
                                                           @PathVariable("user2Id") Long user2Id){
        Optional<User> optionalUser1 = userRepository.findUserByUserId(user1Id);
        if (optionalUser1.isPresent()) {
            User user1 = optionalUser1.get();
            Optional<User> optionalUser2 = userRepository.findUserByUserId(user2Id);
            if (optionalUser2.isPresent()) {
                User user2 = optionalUser2.get();
                Conversation conversation = conversationService.createConversation(user1, user2, message);
                return new ResponseEntity<>(conversation, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getConversations/{userId}")
    public ResponseEntity<List<Conversation>> getConversations(@PathVariable("userId") Long userId){
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Conversation> conversations = conversationService.getConversations(user);
            return new ResponseEntity<>(conversations, HttpStatus.OK);
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
}
