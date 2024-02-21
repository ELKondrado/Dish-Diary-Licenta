import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { UserDto } from '../../Models/User/userDto';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService, 
    private userService: UserService,
    private router: Router
  ) {}

  public user: UserDto | null = null;
  public recipes: Recipe[] = [];
  public editRecipe: Recipe | undefined;
  public deletedRecipe: Recipe | undefined;
  public username: string | undefined;
  public avatarUrl: String | undefined;
  public selectedFile: File | undefined;

  ngOnInit(): void {
    this.fetchData();
    this.fetchUser();
  }

  private fetchData(): void {
    this.authService.initializeApp().then(() => {
      this.user = this.authService.getUser();
      this.username = this.userService.getUsername();
      this.getUserRecipes();
      this.getProfileImage();
    });
  }

  private fetchUser(): void {
    const dropdown = document.querySelector(".dropdown");
    const avatar = dropdown?.querySelector(".lil-avatar");
    const menu = dropdown?.querySelector(".menu");
  
    avatar?.addEventListener('click', () => {
      console.log("MENU")

      menu?.classList.toggle('menu-open');
    });

    const image = document.querySelector('.profile-avatar') as HTMLImageElement;
    const imageContainer = document.querySelector('.profile-avatar-container') as HTMLElement;

    if (image && imageContainer) {
      image.addEventListener('load', () => {
        const containerWidth = imageContainer.offsetWidth;
        const aspectRatio = 1;

        const newWidth = containerWidth;
        const newHeight = containerWidth * aspectRatio;

        image.style.width = `${newWidth}px`;
        image.style.height = `${newHeight}px`;
        console.log( image.style.width)
        console.log( image.style.height)
      });
    }
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
        this.fetchData(); 
      },
      (error) => {
        console.error('Error updating recipe:', error);
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
      this.getUserRecipes();
    }
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
    this.recipeService.addUserNewRecipe(addForm.value, username).subscribe(
      (response: Recipe) => {
        console.log(response);
        addForm.reset();
        this.fetchData(); 
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
          this.fetchData();
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
        this.fetchData();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getProfileImage() {
    if (this.user?.userId) {
      this.userService.getProfileImage(this.user.userId).subscribe(
        (data: any) => {
          this.avatarUrl = this.arrayBufferToBase64(data);
        },
        (error: HttpErrorResponse) => {
          console.error('Error getting profile image:', error);
        }
      );
    }
  }

  public arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = new Uint8Array(buffer);
    const bytes: string[] = [];

    binary.forEach((byte) => {
      bytes.push(String.fromCharCode(byte));
    });

    return 'data:image/jpeg;base64,' + btoa(bytes.join(''));
  }

  public discoverRecipes(): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipes`]);
  }

  public onOpenRecipe(recipe: Recipe): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipe/${recipe.id}`]);
  }

  public userProfile(): void {
    this.router.navigate([`/${this.userService.getUsername()}/profile`]);
  }
 
  public logout(): void {   
    this.authService.logout();
  }
}
