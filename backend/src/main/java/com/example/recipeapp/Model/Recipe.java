package com.example.recipeapp.Model;

import com.sun.istack.NotNull;
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
    @NotNull
    private String name;
    @NotNull
    private String ingredients;
    @NotNull
    private String stepsOfPreparation;
}
