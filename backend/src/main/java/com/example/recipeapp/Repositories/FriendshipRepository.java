package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Modifying
    @Query("DELETE FROM Friendship f WHERE (f.user.userId = :userId AND f.friend.userId = :removedFriendId) OR (f.user.userId = :removedFriendId AND f.friend.userId = :userId)")
    void deleteFriendship(@Param("userId") long userId, @Param("removedFriendId") long removedFriendId);

}
