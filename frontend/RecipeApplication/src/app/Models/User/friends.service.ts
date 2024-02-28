import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../Security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
    private apiServerUrl = 'http://localhost:8080'

    constructor(private http: HttpClient,
                private authService: AuthService) { }
  
    private username: string | undefined;
  
    private getHeaders(): HttpHeaders {
      const accessToken = this.authService.getAccessToken();
      if (accessToken) {
        return new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        });
      }
      throw new Error('Access token not available');
    }

    public sendFriendRequest(userSenderId: number, receiverUserName: string): Observable<void> {
        const headers = this.getHeaders();
        return this.http.post<void>(`${this.apiServerUrl}/user/friends/sendFriendRequest/${userSenderId}/${receiverUserName}`, null, { headers });
    }

    public acceptFriendRequest(notificationId: number): Observable<void> {
        const headers = this.getHeaders();
        return this.http.post<void>(`${this.apiServerUrl}/user/friends/acceptFriendRequest/${notificationId}`, null, { headers });
    }

    public rejectFriendRequest(notificationId: number): Observable<void> {
        const headers = this.getHeaders();
        return this.http.post<void>(`${this.apiServerUrl}/user/friends/rejectFriendRequest/${notificationId}`, null, { headers });
    }
}