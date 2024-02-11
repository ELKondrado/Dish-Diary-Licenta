import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{
  @ViewChild('recipeFormContainer', { read: ViewContainerRef }) 
  recipeFormContainer!: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private recipeService: RecipeService,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
  
  }

  public getRecipes(): void {
    const accessToken = this.authService.getAccessToken();
    console.log('Access token in getRecipes:', accessToken);
  
    this.recipeService.getRecipes().subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
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
    });
  }

  public logout(): void {
    this.authService.logout();
  }
}
