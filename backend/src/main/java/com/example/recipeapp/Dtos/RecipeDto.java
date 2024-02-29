package com.example.recipeapp.Dtos;

import com.example.recipeapp.Model.User;
import lombok.Data;

@Data
public class RecipeDto {
    private String name;
    private String ingredients;
    private String stepsOfPreparation;
    private byte[] image;
    private User userOwner;
}
