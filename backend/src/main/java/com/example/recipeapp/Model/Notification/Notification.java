package com.example.recipeapp.Model.Notification;

import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.User;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @SequenceGenerator(
            name = "notifications_sequence",
            sequenceName = "notifications_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "notifications_sequence"
    )
    private long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;

    @ManyToOne
    @JoinColumn(name = "shared_recipe_id")
    private Recipe sharedRecipe;
}
