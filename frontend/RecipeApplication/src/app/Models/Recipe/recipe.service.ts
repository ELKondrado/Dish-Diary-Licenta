import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe';
import { Observable } from 'rxjs';
import { AuthService } from '../../Security/auth.Service';

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

  public addRecipe(recipe: Recipe): Observable<Recipe> {
    const headers = this.getHeaders();
    return this.http.post<Recipe>(`${this.apiServerUrl}/recipe/add`, recipe, { headers });
  }

  public updateRecipe(recipe: Recipe): Observable<Recipe> {
    const headers = this.getHeaders();
    return this.http.put<Recipe>(`${this.apiServerUrl}/recipe/update`, recipe, { headers });
  }

  public deleteRecipe(recipeId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiServerUrl}/recipe/delete/${recipeId}`, { headers });
  }
}
