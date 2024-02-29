import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../Security/auth.service';
import { Conversation } from './conversation';
import { Message } from '../Message/message';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
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

  public getConversations(userId: number): Observable<Conversation[]> {
    const headers = this.getHeaders();
    return this.http.get<Conversation[]>(`${this.apiServerUrl}/user/conversation/getConversations/${userId}`, { headers });
  }

  public createConversation(user1Id: number, user2Id: number, message: Message): Observable<Conversation>{
    const headers = this.getHeaders();
    return this.http.post<Conversation>(`${this.apiServerUrl}/user/conversation/createConversation/${user1Id}/${user2Id}`, message, { headers });
  }

}