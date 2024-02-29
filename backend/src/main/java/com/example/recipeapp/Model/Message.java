package com.example.recipeapp.Model;

import com.example.recipeapp.Model.User;
import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
@Data
public class Message {
    @Id
    @SequenceGenerator(
            name = "messages_sequence",
            sequenceName = "messages_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "messages_sequence"
    )
    private long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @NotNull
    @Column(name = "content", length = 16384)
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @Column(name = "was_seen")
    private boolean wasSeen;
}