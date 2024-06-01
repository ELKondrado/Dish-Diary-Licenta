package com.example.recipeapp.Controllers;

import com.example.recipeapp.Dtos.RepositoryDto;
import com.example.recipeapp.Model.Repository;
import com.example.recipeapp.Services.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/repository")
public class RepositoryController {
    private final RepositoryService repositoryService;

    @Autowired
    public RepositoryController(RepositoryService repositoryService) {
        this.repositoryService = repositoryService;
    }

    @PostMapping("addRepository/{userId}")
    public ResponseEntity<Repository> addRepository(@RequestBody Repository repository,
                                                    @PathVariable("userId") long userId){
        Repository newRepository = repositoryService.addRepository(repository, userId);
        return new ResponseEntity<>(newRepository, HttpStatus.CREATED);
    }

    @GetMapping("getRepositories/{userId}")
    public ResponseEntity<List<Repository>> getRepositories(@PathVariable("userId") long userId){
        List<Repository> repositories = repositoryService.getRepositories(userId);
        return new ResponseEntity<>(repositories, HttpStatus.OK);
    }

    @GetMapping("getRepositoriesDto/{userId}")
    public ResponseEntity<List<RepositoryDto>> getRepositoriesDto(@PathVariable("userId") long userId){
        List<RepositoryDto> repositories = repositoryService.getRepositoriesDto(userId);
        return new ResponseEntity<>(repositories, HttpStatus.OK);
    }

    @GetMapping("getRepository/{repositoryId}")
    public ResponseEntity<Repository> getRepository(@PathVariable("repositoryId") long repositoryId){
        Repository repository = repositoryService.getRepository(repositoryId);
        return new ResponseEntity<>(repository, HttpStatus.OK);
    }

    @PutMapping("updateRepository/{repositoryId}")
    public ResponseEntity<Repository> updateRepository(@RequestBody Repository updatedRepository,
                                                       @PathVariable("repositoryId") long repositoryId){
        Repository repository = repositoryService.updateRepository(updatedRepository, repositoryId);
        return new ResponseEntity<>(repository, HttpStatus.OK);
    }

    @DeleteMapping("deleteRepository/{repositoryId}")
    public ResponseEntity<Repository> deleteRepository(@PathVariable("repositoryId") long repositoryId){
        repositoryService.deleteRepository(repositoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
