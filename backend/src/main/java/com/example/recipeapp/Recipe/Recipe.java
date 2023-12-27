package com.example.recipeapp.Recipe;

import javax.persistence.*;

@Table
@Entity
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

    public Recipe(long id, String name, String ingredients, String stepsOfPreparation) {
        this.id = id;
        this.name = name;
        this.ingredients = ingredients;
        this.stepsOfPreparation = stepsOfPreparation;
    }

    public Recipe() {
    }

    public Recipe(String name, String ingredients, String stepsOfPreparation) {
        this.name = name;
        this.ingredients = ingredients;
        this.stepsOfPreparation = stepsOfPreparation;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getStepsOfPreparation() {
        return stepsOfPreparation;
    }

    public void setStepsOfPreparation(String stepsOfPreparation) {
        this.stepsOfPreparation = stepsOfPreparation;
    }

    @Override
    public String toString() {
        return "Recipe{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", ingredients=" + ingredients +
                ", stepsOfPreparation='" + stepsOfPreparation + '\'' +
                '}';
    }
}
