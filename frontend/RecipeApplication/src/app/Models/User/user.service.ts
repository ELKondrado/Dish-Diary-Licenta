import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { AuthService } from '../../Security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiServerUrl = 'http://localhost:8080'

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  private username: string | undefined;

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

  setUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string | undefined {
    return this.username;
  }

  public login(user: User): Observable<User>{
    return this.http.post<User>(`${this.apiServerUrl}/auth/login`, user);
  }

  public register(user: User): Observable<User>{ 
    return this.http.post<User>(`${this.apiServerUrl}/auth/register`, user);
  }
//to update
  public getUsers(): Observable<User[]>{
      return this.http.get<User[]>(`${this.apiServerUrl}/users/all`);
  }
//to update
  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/users/add`, user);
  }
 //to update
  public updateUser(user: User): Observable<User>{
      return this.http.put<User>(`${this.apiServerUrl}/users/update`, user);
  }
 //to update
  public deleteUser(userId: number): Observable<void>{
      return this.http.delete<void>(`${this.apiServerUrl}/users/delete/${userId}`);
  }

  public deleteUserRecipe(userId: number, recipeId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiServerUrl}/user/deleteUserRecipe/${userId}/${recipeId}`, { headers });
  }
}
