import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../Security/auth.service';
import { Repository } from './repository';

@Injectable({
  providedIn: 'root'
})

export class RepositoryService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      return new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
    }
    throw new Error('Access token not available');
  }

  public addRepository(userId: number, repository: Repository) : Observable<Repository> {
    const headers = this.getHeaders();
    return this.http.post<Repository>(`${this.apiServerUrl}/repository/addRepository/${userId}`, repository, { headers });
  }

  public getRepositories(userId: number) : Observable<Repository[]> {
    const headers = this.getHeaders();
    return this.http.get<Repository[]>(`${this.apiServerUrl}/repository/getRepositories/${userId}`, { headers });
  }

  public getRepositoriesDto(userId: number) : Observable<Repository[]> {
    const headers = this.getHeaders();
    return this.http.get<Repository[]>(`${this.apiServerUrl}/repository/getRepositoriesDto/${userId}`, { headers });
  }

  public getRepository(repositoryId: number) : Observable<Repository> {
    const headers = this.getHeaders();
    return this.http.get<Repository>(`${this.apiServerUrl}/repository/getRepository/${repositoryId}`, { headers });
  }

  public editRepository(updatedRepository: Repository, repositoryId: number) : Observable<Repository> {
    const headers = this.getHeaders();
    return this.http.put<Repository>(`${this.apiServerUrl}/repository/updateRepository/${repositoryId}`, updatedRepository, { headers });
  }

  public deleteRepository(repositoryId: number) : Observable<Repository> {
    const headers = this.getHeaders();
    return this.http.delete<Repository>(`${this.apiServerUrl}/repository/deleteRepository/${repositoryId}`, { headers });
  }
}
