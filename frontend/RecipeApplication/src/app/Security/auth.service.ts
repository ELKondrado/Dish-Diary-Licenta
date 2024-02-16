import { Injectable, APP_INITIALIZER } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/User/user';
import { UserDto } from '../Models/User/userDto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  private accessTokenKey = 'access_token';
  private user: UserDto | null = null;
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

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  getUsernameFromToken(): string {
    const token = this.accessToken;
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const username = typeof payload.sub === 'string' ? payload.sub : '';
      return username;
    }
    return '';
  }

  getUser(): UserDto | null {
    return this.user;
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem(this.accessTokenKey);
    this.router.navigate(['/login']);
  }

  fetchUserDetails(): Observable<any> {
    const headers = this.getHeaders();
    const username = this.getUsernameFromToken();
    return this.http.get<any>(`${this.apiServerUrl}/user/details/${username}`, { headers });
  }

  loadUser(): Observable<void> {
    return new Observable<void>((observer) => {
      this.fetchUserDetails().subscribe(
        (user: any) => {
          this.user = user;
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.next();
          observer.complete();
        }
      );
    });
  }

  initializeApp(): Promise<void> {
    return this.loadUser().toPromise();
  }

  initializeAuthentication(): Promise<void> {
    const storedToken = localStorage.getItem(this.accessTokenKey);
    if (storedToken) {
      this.setAccessToken(storedToken);
      return this.loadUser().toPromise();
    }
    return Promise.resolve(); 
  }
}
