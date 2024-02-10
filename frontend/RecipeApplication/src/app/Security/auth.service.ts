import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    // Retrieve the access token
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    // Check if the user is logged in (access token is available)
    return !!this.accessToken;
  }

  logout(): void {
    // Clear the stored access token (e.g., on logout)
    this.accessToken = null;
  }
}
