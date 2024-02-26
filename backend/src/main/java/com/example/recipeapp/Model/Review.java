package com.example.recipeapp.Model;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

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
    @Lob
    private byte[] userProfileImage;
    @NotNull
    private String userName;
    @NotNull
    private Byte userStarRating;
    @NotNull
    @Column(length = 2056)
    private String userReviewText;
    @NotNull
    private Date date;
}
