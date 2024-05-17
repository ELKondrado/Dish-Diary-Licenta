import { Component, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { NgForm } from '@angular/forms';
import { User } from '../../Models/User/user';
import { Repository } from '../../Models/Repository/repository';
import { RepositoryService } from '../../Models/Repository/repository.service';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.css'
})
export class RepositoryComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private repositoryService: RepositoryService,
    private authService: AuthService, 
    private userService: UserService,
    private router: Router
  ) {}

  public user: User | null = null;
  public repository: Repository | undefined;
  public recipes: Recipe[] = [];
  public editRecipe: Recipe | undefined;
  public deletedRecipe: Recipe | undefined;
  public avatarUrl: String | undefined;
  public tags: String[] = [
    "APPETIZER","AVOCADO","BBQ","BEVERAGE","BITTER","BREAKFAST","CELEBRATION","CHICKEN","CHINESE","COMFORT_FOOD",
    "DATE_NIGHT","DAIRY_FREE","DESSERT","DIABETIC_FRIENDLY","DINNER","EGG_FREE","FAMILY_MEAL","FINGER_FOOD","FRENCH",
    "FRIENDLY","FALL","FRIED","GARLICKY","GLUTEN_FREE","GRILLED","HEART_HEALTHY","HIGH_PROTEIN","HOLIDAY","HOLIDAY_SPECIAL",
    "INDIAN","ITALIAN","JAPANESE","KETO","LACTOSE_FREE","LOW_CALORIE","LOW_CARB","LOW_FAT","LUNCH","MAIN_COURSE","MEDITERRANEAN",
    "MEATLESS_MONDAY","MEXICAN","NUTRITIOUS","NUT_FREE","ORGANIC","PASTA","PARTY","PARTY_APPETIZER","PALEO","PESCATARIAN","PICNIC",
    "PLANT_BASED","PORK","QUICK_AND_EASY","QUICK_EASY","QUINOA","RICE","ROASTED","SALAD","SALTY","SEAFOOD","SEAFOOD_FREE",
    "SIDE_DISH","SMOKY","SOUP","SOUR","SPICY","SPRING","SUGAR_FREE","SUMMER","SWEET","TANGY","THAI","TOFU","VEGAN","VEGETARIAN",
    "VEGGIE_PASTA","WINTER","WHOLE30"]
  public selectedTag: string = "";
  public addedRecipeTags: String[] = [];
  public editedRecipeTags: String[] = [];

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(() => {
      this.user = this.authService.getUser();
      this.fetchRepository();
    });
  }

  public fetchRepository(): void{
    this.route.params.subscribe((params) => {
      const repositoryId = params['repositoryId'];
      this.repositoryService.getRepository(repositoryId).subscribe(
        (repository: Repository) => {
          this.repository = repository;
          this.getRecipesRepository();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    });
  }

  public getRecipesRepository(): void {
    if(this.repository){
      this.recipeService.getRecipesRepository(this.repository.id).subscribe(
        (response: Recipe[]) => {
          this.recipes = response;
          this.recipes.forEach(recipe => {
            recipe.image = 'data:image/jpeg;base64,' + recipe.image;
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
    else{
      console.error("Repository ID for getRecipesRepository not found!")
    }
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
      this.getRecipesRepository();
    }
  }

  public onOpenModal(recipe: Recipe | undefined, mode: string): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if( mode === 'add') {
      button.setAttribute('data-target', '#createRecipeModal');
    }
    if( mode === 'edit' && recipe) {
      this.editRecipe = recipe;
      this.editedRecipeTags = this.editRecipe.tags;
      button.setAttribute('data-target', '#updateRecipeModal');
      console.log(this.editedRecipeTags)

    }
    if( mode === 'delete' && recipe) {
      this.deletedRecipe = recipe;
      button.setAttribute('data-target', '#deleteRecipeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onCreateRecipe(addForm: NgForm): void {
    const button = document.getElementById('create-recipe-form');   
    button?.click()

    addForm.value["tags"] = this.addedRecipeTags;
    if(this.repository){
      this.recipeService.createNewRecipeInRepository(addForm.value, this.repository.id).subscribe(
        (response: Recipe) => {
          console.log(response);
          addForm.reset();
          this.ngOnInit(); 
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          addForm.reset();
        }
      );
    }
  }

  public addTagToForm(tagValue: String, mode: string): void {
    console.log(tagValue)
    if (tagValue) {
      if(mode == 'add') {
          if(!this.addedRecipeTags.includes(tagValue)){
          this.addedRecipeTags.push(tagValue);
        }
      }
      else if(mode == 'edit') {
        if(!this.editedRecipeTags.includes(tagValue)){
          this.editedRecipeTags.push(tagValue);
        }
      }
    
    }
  }

  public removeTagFromForm(tagValue: String, mode: string): void {
    if (tagValue) {
      if(mode == 'add'){
        if(this.addedRecipeTags.includes(tagValue)){
          this.addedRecipeTags = this.addedRecipeTags.filter(tag => tag !== tagValue);
        }
      } 
      if(mode == 'edit'){
        if(this.editedRecipeTags.includes(tagValue)){
          this.editedRecipeTags = this.editedRecipeTags.filter(tag => tag !== tagValue);
        }
      }
    }
  }

  public onUpdateRecipe(recipeForm: NgForm, recipeId: number): void {
    recipeForm.value["tags"] = this.editedRecipeTags;
    this.recipeService.updateRecipe(recipeForm.value, recipeId).subscribe(
      (response: Recipe) => {
        console.log(response);
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }
  
  public onDeleteRecipe(recipeId: number): void {
    if(this.repository){
      this.recipeService.deleteRecipeFromRepository(recipeId, this.repository?.id).subscribe(
        (response: void) => {
          console.log(response);
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }
  
  public onDeleteRepositoryModal(): void{
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#deleteRepositoryModal');
    container?.appendChild(button);
    button.click();
  }

  public onEditRepositoryModal(): void{
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#editRepositoryModal');
    container?.appendChild(button);
    button.click();
  }

  public deleteRepository(): void{
    if(this.repository){
      this.repositoryService.deleteRepository(this.repository.id).subscribe();
      this.mainPage();
    }
  }

  public editRepository(updatedRecipe: NgForm): void{
    if(this.repository){
      this.repositoryService.editRepository(updatedRecipe.value, this.repository.id).subscribe(
        (response: any) => {
          this.fetchRepository();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public onOpenRecipe(recipe: Recipe): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipe/${recipe.id}`]);
  }

  public mainPage(): void {
    this.router.navigate([`/${this.userService.getUsername()}/starter-page`]);
  }
}
