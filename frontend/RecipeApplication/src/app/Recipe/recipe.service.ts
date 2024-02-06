import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiServerUrl = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  public getRecipes(): Observable<Recipe[]>{
      return this.http.get<Recipe[]>(`${this.apiServerUrl}/recipe/all`);
  }

  public addRecipe(recipe: Recipe): Observable<Recipe>{
      return this.http.post<Recipe>(`${this.apiServerUrl}/recipe/add`, recipe);
  }

  public updateRecipe(recipe: Recipe): Observable<Recipe>{
      return this.http.put<Recipe>(`${this.apiServerUrl}/recipe/update`, recipe);
  }

  public deleteRecipe(recipeId: number): Observable<void>{
      return this.http.delete<void>(`${this.apiServerUrl}/recipe/delete/${recipeId}`);
  }
}
