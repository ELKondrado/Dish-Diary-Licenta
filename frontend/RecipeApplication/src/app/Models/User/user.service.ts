import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiServerUrl = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

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
}
