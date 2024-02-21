import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { Recipe } from '../../Models/Recipe/recipe';
import { UserDto } from '../../Models/User/userDto';
import { HttpErrorResponse } from '@angular/common/http';

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

  public user: UserDto | null = null;
  public recipes: Recipe[] = [];
  public username: string | undefined;
  public addedRecipe: Recipe | undefined;
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
      this.getRecipes();
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
        if (response == null) {
          button.setAttribute('data-target', '#recipeConstraintModal');
          button.click();
        }
        else{
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
      this.fetchData();
    }
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

  public mainPage(): void {
    this.router.navigate([`/${this.userService.getUsername()}/main`]);
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
