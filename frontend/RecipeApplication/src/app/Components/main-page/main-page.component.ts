import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { Recipe } from '../../Models/Recipe/recipe';
import { UserDto } from '../../Models/User/userDto';
import { NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{
  @ViewChild('recipeFormContainer', { read: ViewContainerRef }) 
  recipeFormContainer!: ViewContainerRef;
  public user: UserDto | null = null;

  constructor(
    private resolver: ComponentFactoryResolver,
    private recipeService: RecipeService,
    private authService: AuthService, 
    private userService: UserService,
    private router: Router
  ) {}

  public recipes: Recipe[] | undefined;
  public editRecipe: Recipe | undefined;
  public deletedRecipe: Recipe | undefined;
  public username: string | undefined;

  ngOnInit(): void {
    this.fetchRecipes();
  }

  private fetchRecipes(): void {
    this.authService.initializeApp().then(() => {
      this.user = this.authService.getUser();
      this.username = this.userService.getUsername();
      this.getUserRecipes();
    });
  }

  public getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (response: any) => {
        console.log(response);
        this.recipes = response;
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }

  public getUserRecipes(): void {
    const userId = this.user?.userId ?? -1;
    if(userId != -1)
    {
      this.recipeService.getUserRecipes(userId).subscribe(
        (response: Recipe[]) => {
          console.log(response);
          this.recipes = response;
        },
        (error) => {
          console.error(error);
        }
      );
    }
    else{
      console.error("User ID for getUserRecipes not found!")
    }
  }

  public updateRecipe(event: Event): void {
    event.preventDefault();
    this.recipeService.updateRecipe(29, 'Recipe222', undefined, undefined).subscribe(
      (updatedRecipe: Recipe) => {
        console.log('Recipe updated successfully:', updatedRecipe);
        this.fetchRecipes(); 
      },
      (error) => {
        console.error('Error updating recipe:', error);
      }
    );
  }

  public onOpenModal(recipe: Recipe | undefined, mode: string): void {

    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if( mode === 'add') {
      button.setAttribute('data-target', '#addRecipeModal');
    }
    if( mode === 'edit') {
      this.editRecipe = recipe;
      button.setAttribute('data-target', '#updateRecipeModal');
    }
    if( mode === 'delete') {
      this.deletedRecipe = recipe;
      button.setAttribute('data-target', '#deleteRecipeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddRecipe(addForm: NgForm): void {
    const button = document.getElementById('add-recipe-form');
    const username = this.authService.getUsernameFromToken();
    button?.click()
    this.recipeService.addUserRecipe(addForm.value, username).subscribe(
      (response: Recipe) => {
        console.log(response);
        addForm.reset();
        this.fetchRecipes(); 
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateRecipe(recipe: Recipe): void {
    let recipeName = undefined;
    let recipeIngredients = undefined;
    let recipeStepsOfPreparation = undefined;

    if (this.editRecipe) {
      const recipeId = this.editRecipe.id;

      if(recipe.name != this.editRecipe.name) {
        recipeName = recipe.name;
      }

      if(recipe.ingredients != this.editRecipe.ingredients) {
        recipeIngredients = recipe.ingredients;
      }
 
      if(recipe.stepsOfPreparation != this.editRecipe.stepsOfPreparation) {
        recipeStepsOfPreparation = recipe.stepsOfPreparation;
      }

      this.recipeService.updateRecipe(recipeId, recipeName, recipeIngredients, recipeStepsOfPreparation).subscribe(
        (response: Recipe) => {
          console.log(response);
          this.fetchRecipes();
        },
        (error: HttpErrorResponse) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Recipe before edit not found!");
    }
  }
  
  public onDeleteRecipe(recipeId: number): void {
    const userId = this.user?.userId ?? -1;
    
    this.userService.deleteUserRecipe(userId, recipeId).subscribe(
      (response: void) => {
        console.log(response);
        this.fetchRecipes();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  public openRecipeForm(): void {
    const factory = this.resolver.resolveComponentFactory(RecipeFormComponent);
    const componentRef = this.recipeFormContainer.createComponent(factory);
    // You can pass data to the popup component if needed
    // componentRef.instance.someInput = someData;

    // Subscribe to the close event to clean up when the popup is closed
    componentRef.instance.close.subscribe(() => {
      componentRef.destroy();
    });
    componentRef.instance.recipeCreated.subscribe(() => {
      componentRef.destroy();
      this.fetchRecipes(); 
    });
  }

  public logout(): void {   
    this.authService.logout();
  }
}
