import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../Models/User/user.service';
import { UserDto } from '../../Models/User/userDto';

@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrl: './recipe-info.component.css'
})
export class RecipeInfoComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  public user: UserDto | null = null;
  public username: string | undefined;
  public recipe: Recipe | undefined;

  ngOnInit(): void {
    this.fetchData();
    this.fetchUserMenu();
  }

  public fetchData(): void{
    this.authService.initializeApp().then(() => {
      this.user = this.authService.getUser();
      this.username = this.userService.getUsername();
      this.fetchRecipe();
    });
  }

  private fetchUserMenu(): void {
    const dropdown = document.querySelector(".dropdown");
    const select = dropdown?.querySelector(".select");
    const menu = dropdown?.querySelector(".menu");  
    select?.addEventListener('click', () => {
      menu?.classList.toggle('menu-open');
    });
  }

  public fetchRecipe(): void{
    this.route.params.subscribe((params) => {
      const recipeId = params['recipeId'];
      this.recipeService.getRecipeById(recipeId).subscribe(
        (recipe: Recipe) => {
          console.log(recipe)
          this.recipe = recipe;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    });
  }

  public mainPage(): void {
    this.router.navigate([`/${this.userService.getUsername()}/main`]);
  }

  public discoverRecipes(): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipes`]);
  }

  public userProfile(): void {
    this.router.navigate([`/${this.userService.getUsername()}/profile`]);
  }

  public logout(): void{   
    this.authService.logout();
  }
}
