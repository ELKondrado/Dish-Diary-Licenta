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

  public sendMessage(senderId: number, receiverId: number, requestedBody: string): Observable<Message> {
    const headers = this.getHeaders();
    return this.http.post<Message>(`${this.apiServerUrl}/user/chat/sendMessage/${senderId}/${receiverId}`, requestedBody, { headers });
  }

  public getMessages(userId: number, page: number , pageSize: number): Observable<Message[]> {
      const headers = this.getHeaders();
      return this.http.get<Message[]>(`${this.apiServerUrl}/user/chat/getMessages/?userId=${userId}&page=${page}&pageSize=${pageSize}`, { headers });
  }

  public getMessagesFromUser(user1Id: number, user2Id: number): Observable<Message[]> {
    const headers = this.getHeaders();
    return this.http.get<Message[]>(`${this.apiServerUrl}/user/chat/getMessagesFromUser/${user1Id}/${user2Id}`, { headers });
  }

  public setWasSeenConversation(user1Id: number, user2Id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.put<void>(`${this.apiServerUrl}/user/chat/setWasSeenConversation/${user1Id}/${user2Id}`, null,  { headers });    
  }

  public getUnseenConversations(userId: number): Observable<number> {
    const headers = this.getHeaders();
    return this.http.get<number>(`${this.apiServerUrl}/user/chat/getUnseenMessages/${userId}`, { headers });
  }
}