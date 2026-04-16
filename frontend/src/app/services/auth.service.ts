import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUser, AuthResponse } from '../models/prompt.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    this.checkSession();
  }

  /** Check if user has an active session */
  checkSession(): void {
    this.http.get<AuthResponse>('/api/auth/session/').subscribe({
      next: (res) => {
        if (res.authenticated && res.user) {
          this.currentUser.next(res.user);
        } else {
          this.currentUser.next(null);
        }
      },
      error: () => this.currentUser.next(null)
    });
  }

  /** Login with username and password */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login/', { username, password }).pipe(
      tap(res => {
        if (res.user) {
          this.currentUser.next(res.user);
        }
      })
    );
  }

  /** Logout current user */
  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/logout/', {}).pipe(
      tap(() => this.currentUser.next(null))
    );
  }

  /** Check if user is currently authenticated */
  isAuthenticated(): boolean {
    return this.currentUser.value !== null;
  }

  get user(): AuthUser | null {
    return this.currentUser.value;
  }
}
