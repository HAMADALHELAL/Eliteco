// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environments';

/** ====== API contracts (match your backend) ====== */
export type Role = 'student' | 'teacher'|'admin';

export interface AuthUser {
  _id: string;
  email: string;
  username: string;
  firstName: string;   // ✅ add this
  lastName: string;    // ✅ add this
  role: Role;   
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface LoginDto {
  // your backend uses passport local; typically email OR username + password
  // choose one of these depending on what your login endpoint expects
  email?: string;
  username?: string;
  password: string;
}

/** ====== Service ====== */
const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiBase; // e.g. '/api' when using proxy

  /** Reactive auth state for your app to subscribe to */
  private _isAuthed$ = new BehaviorSubject<boolean>(!!localStorage.getItem(TOKEN_KEY));
  isAuthed$ = this._isAuthed$.asObservable();

  private _user$ = new BehaviorSubject<AuthUser | null>(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  );
  user$ = this._user$.asObservable();

  /** Synchronous getters */
  get token(): string | null { return localStorage.getItem(TOKEN_KEY); }
  get user(): AuthUser | null { return this._user$.value; }

  /** ====== Auth API calls ====== */

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, dto).pipe(
      tap(res => this.persistAuth(res))
    );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, dto).pipe(
      tap(res => this.persistAuth(res))
    );
  }

  /** Returns the current user using your protected /auth/me endpoint */
  me(): Observable<{ user: AuthUser } | AuthUser> {
    // some backends return { user }, others return user directly; handle both on subscribe
    return this.http.get<{ user: AuthUser } | AuthUser>(`${this.base}/auth/me`).pipe(
      tap((res: any) => {
        const user: AuthUser = res?.user ?? res;
        if (user && user._id) {
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          this._user$.next(user);
          this._isAuthed$.next(!!this.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._isAuthed$.next(false);
    this._user$.next(null);
  }
  getProfile(): Observable<AuthUser> {
    return this.http.get<{ user: AuthUser }>(`${this.base}/auth/me`).pipe(
      tap((res: any) => {
        const user: AuthUser = res?.user ?? res;
        if (user && user._id) {
          localStorage.setItem('auth_user', JSON.stringify(user));
          this._user$.next(user);
          this._isAuthed$.next(!!this.token);
        }
      }),
      // unwrap the { user } object so the component just gets the AuthUser
      // if backend returns { user: {...} }
      // otherwise just return res
      // (res.user ?? res) ensures compatibility
      map((res: any) => res?.user ?? res)
    );
  }
  
  /** ====== Helpers ====== */

  private persistAuth(res: Partial<AuthResponse>) {
    if (res?.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
      this._isAuthed$.next(true);
    }
    const user = res?.user;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      this._user$.next(user);
    }
  }
}
