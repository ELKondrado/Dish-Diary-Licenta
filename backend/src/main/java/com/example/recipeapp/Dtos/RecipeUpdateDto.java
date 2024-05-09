package com.example.recipeapp.Dtos;

import lombok.Data;

@Data
public class RecipeUpdateDto {
    private long id;
    private String name;
    private String ingredients;
    private String stepsOfPreparation;
}
