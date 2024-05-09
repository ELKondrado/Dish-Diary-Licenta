package com.example.recipeapp.Repositories;

import com.example.recipeapp.Model.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepositoryRepository extends JpaRepository<Repository, Long> {

    Optional<Repository> findRepositoryById(long id);

    List<Repository> findByUserOwner_UserId(long userId);
}