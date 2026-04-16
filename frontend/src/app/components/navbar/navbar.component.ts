import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" id="main-navbar">
      <div class="navbar-inner">
        <a routerLink="/prompts" class="navbar-brand" id="nav-brand">
          <span class="brand-icon">✦</span>
          <span class="brand-text">PromptVault</span>
        </a>

        <div class="navbar-links">
          <a routerLink="/prompts" routerLinkActive="active"
             [routerLinkActiveOptions]="{exact: true}"
             class="nav-link" id="nav-prompts">
            <span class="nav-icon">◈</span>
            Prompts
          </a>
          <a routerLink="/add-prompt" routerLinkActive="active"
             class="nav-link" id="nav-add-prompt">
            <span class="nav-icon">+</span>
            Create
          </a>

          <ng-container *ngIf="authService.currentUser$ | async as user; else loginLink">
            <div class="nav-user">
              <span class="user-badge">{{ user.username }}</span>
              <button class="nav-link logout-btn" (click)="onLogout()" id="nav-logout">
                Logout
              </button>
            </div>
          </ng-container>
          <ng-template #loginLink>
            <a routerLink="/login" routerLinkActive="active"
               class="nav-link" id="nav-login">
              <span class="nav-icon">⚿</span>
              Login
            </a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(10, 14, 26, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .navbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #f1f5f9;
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: -0.3px;
    }

    .brand-icon {
      font-size: 1.3rem;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-text {
      background: linear-gradient(135deg, #f1f5f9, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .navbar-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 200ms ease;
      cursor: pointer;
      background: transparent;
      border: none;
      font-family: inherit;
    }

    .nav-link:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.06);
    }

    .nav-link.active {
      color: #00d4ff;
      background: rgba(0, 212, 255, 0.08);
    }

    .nav-icon {
      font-size: 0.9rem;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-badge {
      padding: 0.3rem 0.7rem;
      border-radius: 20px;
      background: rgba(124, 58, 237, 0.15);
      color: #a78bfa;
      font-size: 0.8rem;
      font-weight: 500;
      border: 1px solid rgba(124, 58, 237, 0.25);
    }

    .logout-btn {
      color: #94a3b8;
    }

    .logout-btn:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.08);
    }

    @media (max-width: 640px) {
      .navbar-inner {
        padding: 0 1rem;
      }
      .nav-link {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
      }
      .nav-icon {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/prompts']),
      error: () => this.router.navigate(['/prompts'])
    });
  }
}
