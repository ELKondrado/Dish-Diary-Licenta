package com.example.recipeapp.Exceptions;

public class RecipeNameNotFoundException extends RuntimeException{
    public RecipeNameNotFoundException(String message) {
        super(message);
    }
}
