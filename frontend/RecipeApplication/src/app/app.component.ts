import { Component, OnInit } from '@angular/core';
import { Recipe } from './Recipe/recipe';
import { RecipeService } from './Recipe/recipe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { UserService } from './User/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = "RecipeApp";
  public recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService,
              private userService: UserService) {}

  ngOnInit(): void {
    //this.getRecipes();
  }

  public getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (response: Recipe[]) => {
        this.recipes = response;
        console.log(this.recipes)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}
