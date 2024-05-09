package com.example.recipeapp.Controllers;

import com.example.recipeapp.Model.Conversation;
import com.example.recipeapp.Model.Message;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Services.ConversationService;
import com.example.recipeapp.Services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/user/chat")
public class MessageController {
    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/sendMessage/{senderId}/{receiverId}")
    public ResponseEntity<Message> sendMessage(@RequestBody String content,
                                               @PathVariable("senderId") long senderId,
                                               @PathVariable("receiverId") long receiverId){
        Message message = messageService.sendMessage(senderId, receiverId, content);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @GetMapping("/getMessages")
    public ResponseEntity<List<Message>> getMessages(@RequestParam("userId") Long userId,
                                                     @RequestParam("page") Integer page,
                                                     @RequestParam("pageSize") Integer pageSize){
        Page<Message> messagePage = messageService.getMessages(userId, page, pageSize);
        List<Message> messages = messagePage.getContent();
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/getMessagesFromUser/{user1Id}/{user2Id}")
    public ResponseEntity<List<Message>> getMessagesFromUser(@PathVariable("user1Id") long user1Id,
                                                             @PathVariable("user2Id") long user2Id){
        List<Message> messagesFromUser = messageService.getMessagesFromUser(user1Id, user2Id);
        return new ResponseEntity<>(messagesFromUser, HttpStatus.OK);
    }

    @PutMapping("/setWasSeenConversation/{user1Id}/{user2Id}")
    public ResponseEntity<Message> setWasSeenConversation(@PathVariable("user1Id") long user1Id,
                                                          @PathVariable("receiverId") long user2Id){
        messageService.setWasSeenConversation(user1Id, user2Id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getUnseenMessages/{userId}")
    public ResponseEntity<Integer> getUnseenMessages(@PathVariable("userId") long userId){
        Integer unseenConversations = messageService.getUnseenMessages(userId);
        return new ResponseEntity<>(unseenConversations, HttpStatus.OK);
    }
}
