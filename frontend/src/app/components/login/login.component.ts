import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container page-enter">
      <div class="login-wrapper">
        <div class="login-card glass-card" id="login-card">
          <div class="login-header">
            <div class="login-icon">⚿</div>
            <h1 class="login-title">Welcome Back</h1>
            <p class="login-subtitle">Sign in to create and manage prompts</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label class="form-label" for="username">Username</label>
              <input
                class="form-input"
                type="text"
                id="username"
                formControlName="username"
                placeholder="Enter your username"
                autocomplete="username">
              <span class="form-error"
                *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.hasError('required')">
                Username is required.
              </span>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                class="form-input"
                type="password"
                id="password"
                formControlName="password"
                placeholder="Enter your password"
                autocomplete="current-password">
              <span class="form-error"
                *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')">
                Password is required.
              </span>
            </div>

            <div *ngIf="error" class="server-error" id="login-error">
              <span>⚠</span> {{ error }}
            </div>

            <button
              type="submit"
              class="btn btn-primary login-btn"
              [disabled]="loginForm.invalid || submitting"
              id="login-submit-btn">
              <span *ngIf="!submitting">Sign In</span>
              <span *ngIf="submitting" class="spinner">Signing in...</span>
            </button>
          </form>

          <div class="login-hint">
            <p>Default credentials: <code>admin</code> / <code>admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 120px);
      padding: 2rem 0;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 2.5rem;
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .login-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.35rem;
    }

    .login-subtitle {
      color: #64748b;
      font-size: 0.9rem;
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      margin-top: 0.5rem;
    }

    .spinner {
      animation: pulse 1.2s infinite;
    }

    .server-error {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      color: #f87171;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    .login-hint {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .login-hint p {
      font-size: 0.8rem;
      color: #64748b;
    }

    .login-hint code {
      background: rgba(255, 255, 255, 0.06);
      padding: 1px 6px;
      border-radius: 4px;
      color: #94a3b8;
      font-size: 0.8rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/prompts']);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.error || 'Login failed. Please try again.';
      }
    });
  }
}
