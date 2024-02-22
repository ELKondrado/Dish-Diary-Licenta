package com.example.recipeapp.Dtos;

import com.example.recipeapp.Model.User;
import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class RecipeDto {
    private String name;
    private String ingredients;
    private String stepsOfPreparation;
    private byte[] image;
    private User userOwner;
}
