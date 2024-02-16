package com.example.recipeapp.Model;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToMany(mappedBy = "recipes", fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();
}
