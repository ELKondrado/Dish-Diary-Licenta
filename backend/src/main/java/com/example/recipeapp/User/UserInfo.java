package com.example.recipeapp.User;

import com.example.recipeapp.Recipe.Recipe;

import java.util.List;

public class UserInfo {
    private String username;
    List<Recipe> myRecipes;
    List<Recipe> sharedRecipe;

    public UserInfo(String username, List<Recipe> myRecipes, List<Recipe> sharedRecipe) {
        this.username = username;
        this.myRecipes = myRecipes;
        this.sharedRecipe = sharedRecipe;
    }

    @Override
    public String toString() {
        return "UserInfo{}";
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Recipe> getMyRecipes() {
        return myRecipes;
    }

    public void setMyRecipes(List<Recipe> myRecipes) {
        this.myRecipes = myRecipes;
    }

    public List<Recipe> getSharedRecipe() {
        return sharedRecipe;
    }

    public void setSharedRecipe(List<Recipe> sharedRecipe) {
        this.sharedRecipe = sharedRecipe;
    }
}

