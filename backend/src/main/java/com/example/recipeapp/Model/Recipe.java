package com.example.recipeapp.Model;

import com.sun.istack.NotNull;
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
    @NotNull
    @Column(name = "name")
    private String name;
    @NotNull
    @Column(name = "ingredients", length = 512)
    private String ingredients;
    @NotNull
    @Column(name = "steps_of_preparation", length = 2056)
    private String stepsOfPreparation;
    @Lob
    private byte[] image;

    @ManyToMany(mappedBy = "recipes", fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();
}
