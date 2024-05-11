package com.example.recipeapp.Model;

import com.example.recipeapp.Model.Recipe.Recipe;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table
@Data
public class Repository {
    @Id
    @SequenceGenerator(
            name = "repository_sequence",
            sequenceName = "repository_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "repository_sequence"
    )
    private long id;

    @NotNull
    private String name;

    @ManyToOne
    private User userOwner;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "repositories_recipes",
            joinColumns = @JoinColumn(name = "repository_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "recipe_id", referencedColumnName = "id")
    )
    private List<Recipe> recipes = new ArrayList<>();
}
