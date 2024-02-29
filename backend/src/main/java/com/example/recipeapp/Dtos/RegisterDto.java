package com.example.recipeapp.Dtos;

import lombok.Data;

@Data
public class RegisterDto {
    private String username;
    private String password;
    private String confirmPassword;
    private String nickname;
    private String email;
}
