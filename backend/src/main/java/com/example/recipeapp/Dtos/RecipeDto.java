package com.example.recipeapp.Dtos;

import lombok.Data;

@Data
public class RecipeDto {
    private String name;
    private String ingredients;
    private String stepsOfPreparation;
}
