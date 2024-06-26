import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notif } from './notification';
import { AuthService } from '../../Security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
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

  public getNotifications(userId: number): Observable<Notif[]> {
    const headers = this.getHeaders();
    return this.http.get<Notif[]>(`${this.apiServerUrl}/user/notifications/getNotifications/${userId}`, { headers });
  }

  public getNotificationsCount(userId: number): Observable<number> {
    const headers = this.getHeaders();
    return this.http.get<number>(`${this.apiServerUrl}/user/notifications/getNotificationsCount/${userId}`, { headers });
  }

  public rejectRecipeShare(notificationId: number): Observable<number> {
    const headers = this.getHeaders();
    return this.http.put<number>(`${this.apiServerUrl}/user/notifications/rejectRecipeShare/${notificationId}`, null, { headers });
  }

  public acceptRecipeShare(notificationId: number): Observable<number> {
    const headers = this.getHeaders();
    return this.http.put<number>(`${this.apiServerUrl}/user/notifications/acceptRecipeShare/${notificationId}`, null, { headers });
  }
}