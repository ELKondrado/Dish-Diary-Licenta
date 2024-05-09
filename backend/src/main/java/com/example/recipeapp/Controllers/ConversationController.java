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
    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping("/createConversation/{user1Id}/{user2Id}")
    public ResponseEntity<Conversation> createConversation(@RequestBody Message message,
                                                           @PathVariable("user1Id") Long user1Id,
                                                           @PathVariable("user2Id") Long user2Id){
        Conversation conversation = conversationService.createConversation(user1Id, user2Id, message);
        return new ResponseEntity<>(conversation, HttpStatus.CREATED);

    }

    @GetMapping("/getConversations/{userId}")
    public ResponseEntity<List<Conversation>> getConversations(@PathVariable("userId") Long userId){
        List<Conversation> conversations = conversationService.getConversations(userId);
        return new ResponseEntity<>(conversations, HttpStatus.OK);

    }
}
