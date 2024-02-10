package com.example.recipeapp.Model;

import lombok.Data;

import javax.persistence.*;

@Table
@Entity
@Data
public class Recipe {
    @Id
    @SequenceGenerator(
            name = "recipe_sequence",
            sequenceName = "recipe_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "recipe_sequence"
    )
    private long id;
    private String name;
    private String ingredients;
    private String stepsOfPreparation;
}
