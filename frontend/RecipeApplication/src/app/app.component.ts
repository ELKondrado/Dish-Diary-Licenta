import { Component, HostListener, OnInit } from '@angular/core';
import { Recipe } from './Models/Recipe/recipe';
import { RecipeService } from './Models/Recipe/recipe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { UserService } from './Models/User/user.service';
import { AuthService } from './Security/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = "RecipeApp";

  constructor(private authService: AuthService) {
    this.authService.initializeAuthentication();
  }

  ngOnInit(): void {
    
  }
}
