import { Component, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../../Models/Recipe/recipe';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../Security/auth.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() recipeCreated = new EventEmitter<Recipe>();

  constructor(private recipeService: RecipeService,
              private authService: AuthService) {}
  
  currentStep = 1;
  recipe: Recipe = {id: -1, name: '', ingredients: '' , stepsOfPreparation: ''};

  nextStep(): void {
    this.currentStep++;
  }

  backStep(): void{
    this.currentStep--;
  }

  createRecipe(): void {
    const accessToken = this.authService.getAccessToken();
    const username = this.authService.getUsernameFromToken();
  
    this.recipeService.addUserRecipe(this.recipe, username).subscribe(
      (response: Recipe) => {
        console.log(response);
        this.recipeCreated.emit(response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }

  closeFormPopup(): void {
    this.close.emit();
  }
}
