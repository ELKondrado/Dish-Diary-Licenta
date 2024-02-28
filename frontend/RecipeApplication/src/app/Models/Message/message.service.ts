import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message';
import { AuthService } from '../../Security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiServerUrl = 'http://localhost:8080'

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
      const accessToken = this.authService.getAccessToken();
      if (accessToken) {
      return new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
      });
      }
      throw new Error('Access token not available');
  }

  public getMessages(userId: number): Observable<Message[]> {
      const headers = this.getHeaders();
      return this.http.get<Message[]>(`${this.apiServerUrl}/user/chat/getMessages/${userId}`, { headers });
  }
}