import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.Service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  constructor(
    private recipeService: RecipeService,
    private authService: AuthService, 
    private router: Router
  ) {}

  public getRecipes(): void {
    const accessToken = this.authService.getAccessToken();
    console.log('Access token in getRecipes:', accessToken);
  
    this.recipeService.getRecipes().subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.error.error);
        // Handle authentication error
      }
    );
  }
}
