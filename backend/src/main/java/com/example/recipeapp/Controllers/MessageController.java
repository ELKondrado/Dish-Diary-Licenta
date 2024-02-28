package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Friendship;
import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.MessageRepository;
import com.example.recipeapp.Repositories.NotificationRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.MessageService;
import com.example.recipeapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageController(MessageService messageService, MessageRepository messageRepository, UserRepository userRepository) {
        this.messageService = messageService;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/sendMessage/{senderId}/{receiverId}")
    public ResponseEntity<Message> sendMessage(@RequestBody String content,
                                               @PathVariable("senderId") Long senderId,
                                               @PathVariable("receiverId") Long receiverId){
        Optional<User> optionalSender = userRepository.findUserByUserId(senderId);
        if (optionalSender.isPresent()) {
            User sender = optionalSender.get();
            Optional<User> optionalReceiver = userRepository.findUserByUserId(receiverId);
            if (optionalReceiver.isPresent()) {
                User receiver = optionalReceiver.get();
                Message message = messageService.sendMessage(sender, receiver, content);
                return new ResponseEntity<>(message, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getMessages/{user1Id}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable("user1Id") long user1Id){
        Optional<User> optionalUser1 = userRepository.findUserByUserId(user1Id);
        if (optionalUser1.isPresent()) {
            User user1 = optionalUser1.get();
            List<Message> messages = messageRepository.getMessages(user1.getUserId());
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
