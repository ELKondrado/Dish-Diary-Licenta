package com.example.recipeapp.Model.Recipe;

import com.example.recipeapp.Model.Review;
import com.example.recipeapp.Model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
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
    @Column(name = "ingredients", length = 4096)
    private String ingredients;

    @NotNull
    @Column(name = "steps_of_preparation", length = 8192)
    private String stepsOfPreparation;

    @Lob
    private byte[] image;

    @ElementCollection(targetClass = RecipeTag.class)
    @CollectionTable(name = "recipe_tags", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "tag")
    @Enumerated(EnumType.STRING)
    private List<RecipeTag> tags;

    @Column(name = "date_created")
    private Date dateCreated;

    @ManyToMany(mappedBy = "recipes", fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private User userOwner;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "recipe_review", joinColumns = @JoinColumn(name = "recipe_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "review_id", referencedColumnName = "id"))
    private List<Review> reviews;
}
