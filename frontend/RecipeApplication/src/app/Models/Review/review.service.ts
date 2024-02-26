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
  
}