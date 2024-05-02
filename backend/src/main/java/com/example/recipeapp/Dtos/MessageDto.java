package com.example.recipeapp.Dtos;

import lombok.Data;

@Data
public class MessageDto {
    private Long senderId;
    private Long receiverId;
    private String content;
}
