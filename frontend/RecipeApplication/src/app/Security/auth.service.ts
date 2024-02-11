import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  private accessTokenKey = 'access_token';

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
  }

  initializeAuthentication(): void {
    const storedToken = localStorage.getItem(this.accessTokenKey);
    console.log(storedToken)
    if (storedToken) {
      this.setAccessToken(storedToken);
    }
  }
}
