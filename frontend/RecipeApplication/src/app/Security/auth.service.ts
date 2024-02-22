import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../Models/User/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  private accessTokenKey = 'access_token';
  private user: User | null = null;
  private apiServerUrl = 'http://localhost:8080';

  constructor(private router: Router, private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
    }
    throw new Error('Access token not available');
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem(this.accessTokenKey, token);
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  public getUsernameFromToken(): string {
    const token = this.accessToken;
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const username = typeof payload.sub === 'string' ? payload.sub : '';
      return username;
    }
    return '';
  }

  public getUser(): User | null {
    return this.user;
  }

  public logout(): void {
    this.accessToken = null;
    localStorage.removeItem(this.accessTokenKey);
    this.router.navigate(['/login']);
  }

  public fetchUserDetails(): Observable<User> {
    const headers = this.getHeaders();
    const username = this.getUsernameFromToken();
    return this.http.get<User>(`${this.apiServerUrl}/user/details/${username}`, { headers });
  }

  public loadUser(): Observable<void> {
    return this.fetchUserDetails().pipe(
      tap((user: any) => {
        this.user = user;
      }),
      catchError((error) => {
        console.error('Error loading user details:', error);
        return of();
      })
    );
  }

  public initializeApp(): Observable<void> {
    return this.loadUser();
  }

  public initializeAuthentication(): Observable<void> {
    const storedToken = localStorage.getItem(this.accessTokenKey);
    if (storedToken) {
      this.setAccessToken(storedToken);
      return this.loadUser();
    }
    return of();
  }
}
