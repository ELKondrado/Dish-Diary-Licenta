import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from './review';
import { AuthService } from '../../Security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
    private apiServerUrl = 'http://localhost:8080'

    constructor(private http: HttpClient,
                private authService: AuthService) { }
  
    private username: string | undefined;
  
    private getHeaders(): HttpHeaders {
      const accessToken = this.authService.getAccessToken();
      if (accessToken) {
        return new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        });
      }
      throw new Error('Access token not available');
    }
  
    
  public getReviewsForRecipe(recipeId: number): Observable<Review[]> {
    const headers = this.getHeaders();
    return this.http.get<Review[]>(`${this.apiServerUrl}/recipe/getReviewsForRecipe/${recipeId}`, { headers });
  }

  public addReviewToRecipe(recipeId: number, username: string, review: Review): Observable<Review> {
    const headers = this.getHeaders();
    return this.http.post<Review>(`${this.apiServerUrl}/recipe/addReviewToRecipe/${recipeId}/${username}`, review, { headers });
  }

  public deleteReviewsForRecipe(recipeId: number, reviewId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiServerUrl}/recipe/deleteReview/${recipeId}/${reviewId}`, { headers });
  }
}