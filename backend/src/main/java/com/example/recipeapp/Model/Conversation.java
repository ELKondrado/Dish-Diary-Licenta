package com.example.recipeapp.Model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "conversations")
@Data
public class Conversation {
    @Id
    @SequenceGenerator(
            name = "conversations_sequence",
            sequenceName = "conversations_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "conversations_sequence"
    )
    private long id;

    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @ManyToOne
    @JoinColumn(name = "last_message", nullable = false)
    private Message lastMessage;
}
