import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe';
import { Observable } from 'rxjs';
import { AuthService } from '../../Security/auth.service';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
    }
    throw new Error('Access token not available');
  }

  public getRecipes(): Observable<Recipe[]> {
    const headers = this.getHeaders();
    return this.http.get<Recipe[]>(`${this.apiServerUrl}/recipe/all`, { headers });
  }

  //adding recipes through recipe-form
  public addUserRecipe(recipe: Recipe, username: string): Observable<Recipe> {
    const headers = this.getHeaders();
    const requestedBody = { ...recipe };
  
    return this.http.post<Recipe>(`${this.apiServerUrl}/recipe/addUserRecipe?username=${username}`, requestedBody, { headers });
  }

  //getting all the recipes that a user has added
  public getUserRecipes(userId: number): Observable<Recipe[]> {
    const headers = this.getHeaders();
    return this.http.get<Recipe[]>(`${this.apiServerUrl}/recipe/user/${userId}/recipes`, { headers });
  }

  public addRecipe(recipe: Recipe): Observable<Recipe> {
    const headers = this.getHeaders();
    return this.http.post<Recipe>(`${this.apiServerUrl}/recipe/add`, recipe, { headers });
  }

  public updateRecipe(recipeId: number, name?: string, ingredients?: string, stepsOfPreparation?: string): Observable<Recipe> {
    const headers = this.getHeaders();
  
    const requestBody: any = {};
    if (name !== undefined) {
      requestBody.name = name;
    }
    if (ingredients !== undefined) {
      requestBody.ingredients = ingredients;
    }
    if (stepsOfPreparation !== undefined) {
      requestBody.stepsOfPreparation = stepsOfPreparation;
    }
  
    return this.http.put<Recipe>(`${this.apiServerUrl}/recipe/update/${recipeId}`, requestBody, { headers });
  }

  public deleteRecipe(recipeId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiServerUrl}/recipe/delete/${recipeId}`, { headers });
  }
}
