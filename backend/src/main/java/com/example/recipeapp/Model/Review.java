package com.example.recipeapp.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Table
@Entity
@Data
public class Review {
    @Id
    @SequenceGenerator(
            name = "review_sequence",
            sequenceName = "review_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "review_sequence"
    )
    private long id;

    @NotNull
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private User userOwner;

    @NotNull
    private Byte userStarRating;

    @NotNull
    @Column(length = 2056)
    private String userReviewText;

    @Column(name = "likes")
    private long likes;

    @NotNull
    private Date date;

    @JsonIgnore
    @ManyToMany(mappedBy = "likedReviews", cascade = CascadeType.ALL)
    private Set<User> likedByUsers = new HashSet<>();

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Review review = (Review) obj;
        return Objects.equals(id, review.id);
    }
}
