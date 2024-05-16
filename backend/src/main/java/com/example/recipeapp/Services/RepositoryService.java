package com.example.recipeapp.Services;

import com.example.recipeapp.Dtos.RepositoryDto;
import com.example.recipeapp.Exceptions.NotFound;
import com.example.recipeapp.Model.Recipe.Recipe;
import com.example.recipeapp.Model.Repository;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RepositoryRepository;
import com.example.recipeapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class RepositoryService {
    private final RepositoryRepository repositoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public RepositoryService(RepositoryRepository repositoryRepository, UserRepository userRepository) {
        this.repositoryRepository = repositoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Repository addRepository(Repository repositoryDto, long userId){
        Optional<User> optionalUser = userRepository.findUserByUserId(userId);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            Repository repository = new Repository();

            repository.setName(repositoryDto.getName());
            repository.setUserOwner(user);
            user.getRepositories().add(repository);
            return repositoryRepository.save(repository);
        } else{
            throw new NotFound("User with id " + userId + " not found in adding the repository");
        }
    }

    public List<Repository> getRepositories(long userId){
        return repositoryRepository.findByUserOwner_UserId(userId);
    }

    public Repository getRepository(long repositoryId){
        Optional<Repository> optionalRepository =  repositoryRepository.findRepositoryById(repositoryId);
        if(optionalRepository.isPresent()){
            return optionalRepository.get();
        }
        else {
            throw new NotFound("Repository with id "+ repositoryId + " not found");
        }
    }

    public void deleteRepository(long repositoryId){
        Optional<Repository> optionalRepository = repositoryRepository.findRepositoryById(repositoryId);
        if(optionalRepository.isPresent()){
            Repository repository = optionalRepository.get();

            User userOwner = repository.getUserOwner();
            userOwner.getRepositories().remove(repository);
            repositoryRepository.deleteById(repositoryId);
        } else {
            throw new NotFound("Repository with id: " + repositoryId + " does not exist");
        }
    }
}
