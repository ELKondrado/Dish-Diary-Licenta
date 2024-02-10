package com.example.recipeapp.Exceptions;

public class RecipeIngredientsNotFoundException extends RuntimeException{
    public RecipeIngredientsNotFoundException(String message) {
        super(message);
    }
}
