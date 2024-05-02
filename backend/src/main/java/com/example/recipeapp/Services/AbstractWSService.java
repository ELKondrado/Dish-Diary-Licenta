package com.example.recipeapp.Services;

import com.example.recipeapp.WebSocket.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class AbstractWSService {
    @Autowired
    protected WebSocketService webSocketService;

    protected abstract String getEntityTopic();

    public void notifyFrontend() {
        final String entityTopic = getEntityTopic();
        if(entityTopic == null) {
            return;
        }
        webSocketService.sendMessage(entityTopic);
    }
}
