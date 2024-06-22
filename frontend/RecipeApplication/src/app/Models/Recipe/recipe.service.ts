import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe';
import { Observable } from 'rxjs';
import { AuthService } from '../../Security/auth.service';
import { Notif } from '../Notification/notification';

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
        Authorization: `Bearer ${accessToken}`,
      });
    }
    throw new Error('Access token not available');
  }

  public getRecipes(): Observable<Recipe[]> {
    const headers = this.getHeaders();
    return this.http.get<Recipe[]>(`${this.apiServerUrl}/recipe/getAllRecipes`, { headers });
  }

  public getUserTotalRecipes(userId: number): Observable<Recipe[]> {
    const headers = this.getHeaders();
    return this.http.get<Recipe[]>(`${this.apiServerUrl}/recipe/getUserTotalRecipes/${userId}`, { headers });
  }

  public getCreatedRecipes(userId: number): Observable<Recipe[]> {
    const headers = this.getHeaders();
    return this.http.get<Recipe[]>(`${this.apiServerUrl}/recipe/createdRecipes/${userId}`, { headers });
  }

  public getRecipeById(recipeId: number): Observable<Recipe>{
    const headers = this.getHeaders();
    return this.http.get<Recipe>(`${this.apiServerUrl}/recipe/findRecipe/${recipeId}`, { headers });
  }

  public createNewRecipeInRepository(recipe: Recipe, repositoryId: number): Observable<Recipe> {
    const headers = this.getHeaders();  
    return this.http.post<Recipe>(`${this.apiServerUrl}/recipe/createNewRecipeInRepository/${repositoryId}`, recipe, { headers });
  }

  public addRecipeToRepository(recipeId: number, repositoryId: number): Observable<Recipe> {
    const headers = this.getHeaders();
    return this.http.post<Recipe>(`${this.apiServerUrl}/recipe/addRecipeToRepository/${recipeId}/${repositoryId}`, null, { headers });
  }

  public getRecipesRepository(repositoryId: number): Observable<Recipe[]> {
    const headers = this.getHeaders();
    return this.http.get<Recipe[]>(`${this.apiServerUrl}/recipe/getRecipesFromRepository/${repositoryId}`, { headers });
  }

  public updateRecipe(recipe: Recipe, recipeId: number): Observable<Recipe> {
    const headers = this.getHeaders();
    return this.http.put<Recipe>(`${this.apiServerUrl}/recipe/updateRecipe/${recipeId}`, recipe, { headers });
  }

  public deleteRecipeFromRepository(recipeId: number, repositoryId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiServerUrl}/recipe/deleteRecipeFromRepository/${recipeId}/${repositoryId}`, { headers });
  }

  public uploadImage(recipeId: number, formData: FormData) {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiServerUrl}/recipe/${recipeId}/uploadImage`, formData, { headers } );
  }
  
  public getImage(recipeId: number) {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiServerUrl}/recipe/${recipeId}/getImage`, { headers, responseType: 'arraybuffer' });
  }

  public shareRecipe(userId: number, recipeId: number, friendId: number): Observable<Notif> {
    const headers = this.getHeaders();
    return this.http.post<Notif>(`${this.apiServerUrl}/recipe/share/?userId=${userId}&recipeId=${recipeId}&friendId=${friendId}`, null, { headers });
  }
}
