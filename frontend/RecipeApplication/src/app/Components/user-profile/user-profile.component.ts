import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { UserDto } from '../../Models/User/userDto';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
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

  public mainPage(): void {
    this.router.navigate([`/${this.userService.getUsername()}/main`]);
  }

  public discoverRecipes(): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipes`]);
  }

  public logout(): void{   
    this.authService.logout();
  }
}
