import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  private accessTokenKey = 'access_token';

  constructor(private router: Router) {}

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem(this.accessTokenKey);
    this.router.navigate(['/login']);
  }

  initializeAuthentication(): void {
    const storedToken = localStorage.getItem(this.accessTokenKey);
    console.log(storedToken)
    if (storedToken) {
      this.setAccessToken(storedToken);
    }
  }
}
