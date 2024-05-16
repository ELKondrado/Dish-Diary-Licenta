import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../Models/User/user';

@Component({
  selector: 'app-discover-recipes',
  templateUrl: './discover-recipes.component.html',
  styleUrl: './discover-recipes.component.css'
})
export class DiscoverRecipesComponent implements OnInit{
  constructor(
    private recipeService: RecipeService,
    private authService: AuthService, 
    private userService: UserService,
    private router: Router
  ) {}

  public user: User | null = null;
  public recipes: Recipe[] = [];
  public repositoryRecipes: Recipe[] = [];
  public addedRecipe: Recipe | undefined;
  public avatarUrl: String | undefined;

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(() => {
      this.user = this.authService.getUser();
      this.getRecipes();
      this.getRepositoryRecipes();
    });
  }

  public getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (response: Recipe[]) => {
        console.log(response);
        this.recipes = response;
        this.recipes.forEach(recipe => {
          recipe.image = 'data:image/jpeg;base64,' + recipe.image;
        });
        this.filterDiscoverRecipes();
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }

  public getRepositoryRecipes(): void {
    if(this.user)
    {
      this.recipeService.getUserTotalRecipes(this.user?.userId).subscribe(
        (response: Recipe[]) => {
          this.repositoryRecipes = response;
          this.filterDiscoverRecipes();
        },
        (error: HttpErrorResponse) => {
          console.error(error.message);
        }
      );
    }
  }

  public filterDiscoverRecipes() {
    const filteredRecipes = this.recipes.filter(recipe1 =>
      !this.repositoryRecipes.some(recipe2 => recipe1.id === recipe2.id)
    );
    this.recipes = filteredRecipes;
  }

  public onAddRecipeModal(recipe: Recipe | undefined): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    this.addedRecipe = recipe;

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#addRecipeToUserModal');

    container?.appendChild(button);
    button.click();
  }

  public addRecipeToUser(recipeId: number): void {
    const username = this.authService.getUsernameFromToken();

    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    container?.appendChild(button);

    this.recipeService.addUserRecipe(username, recipeId).subscribe(
      (response: any) => {
        if (response) {
          this.getRepositoryRecipes();
          button.setAttribute('data-target', '#recipeSuccesModal');
          button.click();
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  public searchRecipe(key: string): void {
    const resultRecipes: Recipe[] = [];
    for (const recipe of this.recipes) {
      if (recipe.name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        resultRecipes.push(recipe);
      }
    }
    this.recipes = resultRecipes;
    if (resultRecipes.length === 0 || !key){
      this.ngOnInit();
    }
  }

  public onOpenRecipe(recipe: Recipe): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipe/${recipe.id}`]);
  }
}
