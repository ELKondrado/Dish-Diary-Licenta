import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../Models/User/user';
import { RepositoryService } from '../../Models/Repository/repository.service';
import { Repository } from '../../Models/Repository/repository';

@Component({
  selector: 'app-discover-recipes',
  templateUrl: './discover-recipes.component.html',
  styleUrl: './discover-recipes.component.css'
})
export class DiscoverRecipesComponent implements OnInit {
  constructor(
    private recipeService: RecipeService,
    private repositoryService: RepositoryService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  public user: User | null = null;
  public recipes: Recipe[] = [];
  public repositoryRecipes: Recipe[] = [];
  public repositories: Repository[] = [];
  public addedRecipe: Recipe | undefined;
  public avatarUrl: String | undefined;

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(() => {
      this.user = this.authService.getUser();
      this.getRecipes();
      this.getRepositories();
    });
  }

  public getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (response: Recipe[]) => {
        this.recipes = response;
        this.recipes.forEach(recipe => {
          recipe.image = 'data:image/jpeg;base64,' + recipe.image;
        });
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }

  public getRepositories(): void {
    if (this.user) {
      this.repositoryService.getRepositoriesDto(this.user.userId).subscribe(
        (response: Repository[]) => {
          this.repositories = response;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      )
    }
  }

  public onAddRecipeModal(recipe: Recipe | undefined): void {
    this.getRepositories();
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    this.addedRecipe = recipe;

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#addRecipeToRepositoryModal');

    container?.appendChild(button);
    button.click();
  }

  public addRecipeToRepository(recipeId: number, repository: Repository): void {
    this.recipeService.addRecipeToRepository(recipeId, repository.id).subscribe(
      (response: any) => {
        if (response) {
          repository.addedRecipe = true;
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  public searchRecipe(key: string): void {
    const resultRecipes: Recipe[] = [];
    const lowerKey = key.toLowerCase();

    for (const recipe of this.recipes) {
      const lowerName = recipe.name.toLowerCase();
      const nameMatch = lowerName.includes(lowerKey);

      const tagMatch = recipe.tags.some(tag => tag.toLowerCase().includes(lowerKey));

      const lowerIngredients = recipe.ingredients.toLowerCase();
      const ingredientsMatch = lowerIngredients.includes(lowerKey);

      if (nameMatch || tagMatch || ingredientsMatch) {
        resultRecipes.push(recipe);
      }
    }
    this.recipes = resultRecipes;

    if (resultRecipes.length === 0 || !key) {
      this.ngOnInit();
    }
  }

  public onOpenRecipe(recipe: Recipe): void {
    this.router.navigate([`/recipe/${recipe.id}`]);
  }
}
