import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../Security/auth.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { User } from '../../Models/User/user';
import { RepositoryService } from '../../Models/Repository/repository.service';
import { Repository } from '../../Models/Repository/repository';
import { NgForm } from '@angular/forms';
import { AddRepositoryDto } from '../../Models/Repository/addRepositoryDto';

@Component({
  selector: 'app-starter-page',
  templateUrl: './starter-page.component.html',
  styleUrl: './starter-page.component.css'
})
export class StarterPageComponent implements OnInit{
  constructor(
    private authService: AuthService, 
    private userService: UserService,
    private repositoryService: RepositoryService,
    private router: Router
  ) {}

  public user: User | null = null;
  public repositories: Repository[] = [];
  public avatarUrl: String | undefined;

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(() => {
      this.user = this.authService.getUser();
      this.getRepositories();
    });
  }

  // change in searchUser
  // public searchRecipe(key: string): void {
  //   const resultRecipes: Recipe[] = [];
  //   for (const recipe of this.recipes) {
  //     if (recipe.name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
  //       resultRecipes.push(recipe);
  //     }
  //   }
  //   this.recipes = resultRecipes;
  //   if (resultRecipes.length === 0 || !key){
  //     //this.getUserRecipes();
  //   }
  // }

  public onCreateRepositoryModal(): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#createRepositoryModal');
    container?.appendChild(button);
    button.click();
  }

  public createRepository(repository: NgForm): void {
    if(this.user){
      this.repositoryService.addRepository(this.user.userId, repository.value).subscribe(
        ( response: Repository) => {
          console.log(response);
        },
        ( error: HttpErrorResponse) => {
          console.error(error);
        } 
      )
    }
  }

  public getRepositories(): void {
    if(this.user){
      this.repositoryService.getRepositories(this.user.userId).subscribe(
        ( response: Repository[]) => {
          console.log(response);
          this.repositories = response;
        },
        ( error: HttpErrorResponse) => {
          console.error(error);
        } 
      )
    }
  }

  public onOpenRepository(repository: Repository): void {
    this.router.navigate([`/${this.userService.getUsername()}/repository/${repository.id}`]);
  }
}
