package com.example.recipeapp.Dtos;

import lombok.Data;

@Data
public class UserEditProfileDto {
    private String userNicknameToChange;
    private String userBioToChange;
}
