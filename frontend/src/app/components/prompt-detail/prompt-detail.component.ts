import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container page-enter">
      <!-- Back link -->
      <a routerLink="/prompts" class="back-link" id="back-to-list">
        <span>←</span> Back to Library
      </a>

      <!-- Loading -->
      <div *ngIf="loading" class="detail-skeleton">
        <div class="loading-skeleton" style="height: 36px; width: 60%; margin-bottom: 1rem;"></div>
        <div class="loading-skeleton" style="height: 20px; width: 30%; margin-bottom: 2rem;"></div>
        <div class="loading-skeleton" style="height: 200px; width: 100%;"></div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="error-state" id="detail-error">
        <div class="empty-state-icon">⚠</div>
        <h2>{{ error }}</h2>
        <a routerLink="/prompts" class="btn btn-secondary" style="margin-top: 1rem;">
          Back to Library
        </a>
      </div>

      <!-- Detail Card -->
      <article *ngIf="!loading && !error && prompt" class="detail-card glass-card" id="prompt-detail-card">
        <!-- Header -->
        <div class="detail-header">
          <div class="header-left">
            <h1 class="detail-title" id="prompt-title">{{ prompt.title }}</h1>
            <div class="detail-meta">
              <span class="meta-item">
                <span class="meta-icon">◷</span>
                {{ prompt.created_at | date:'fullDate' }}
              </span>
            </div>
          </div>
          <div class="header-right">
            <span
              class="complexity-badge"
              [ngClass]="getComplexityClass(prompt.complexity)"
              id="prompt-complexity">
              <span class="complexity-value">{{ prompt.complexity }}</span>
              <span class="complexity-label">/10 Complexity</span>
            </span>
          </div>
        </div>

        <!-- Tags -->
        <div class="detail-tags" *ngIf="prompt.tags && prompt.tags.length > 0">
          <span *ngFor="let tag of prompt.tags" class="tag-chip">{{ tag }}</span>
        </div>

        <!-- Content -->
        <div class="detail-content" id="prompt-content">
          <h2 class="section-label">Prompt Content</h2>
          <div class="content-box">
            <p>{{ prompt.content }}</p>
          </div>
        </div>

        <!-- View Counter -->
        <div class="view-counter" id="view-counter">
          <div class="counter-inner">
            <div class="counter-icon">👁</div>
            <div class="counter-info">
              <span class="counter-value">{{ prompt.view_count || 0 }}</span>
              <span class="counter-label">{{ (prompt.view_count || 0) === 1 ? 'View' : 'Views' }}</span>
            </div>
          </div>
          <p class="counter-hint">View count increments each time this page loads</p>
        </div>
      </article>
    </div>
  `,
  styles: [`
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 1.5rem 0;
      transition: color 200ms ease;
    }

    .back-link:hover {
      color: #00d4ff;
    }

    .detail-card {
      padding: 2.5rem;
      margin-bottom: 3rem;
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .detail-title {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #f1f5f9;
      line-height: 1.3;
      margin-bottom: 0.75rem;
    }

    .detail-meta {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #64748b;
      font-size: 0.85rem;
    }

    .meta-icon {
      opacity: 0.7;
    }

    .complexity-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 1.5rem;
      border-radius: 14px;
      text-align: center;
    }

    .complexity-badge.badge-low {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .complexity-badge.badge-medium {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.2);
    }

    .complexity-badge.badge-high {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .complexity-value {
      font-size: 1.75rem;
      font-weight: 800;
      line-height: 1;
    }

    .complexity-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 0.25rem;
      opacity: 0.8;
    }

    .detail-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .section-label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 0.75rem;
    }

    .content-box {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .content-box p {
      color: #cbd5e1;
      font-size: 1.05rem;
      line-height: 1.8;
    }

    /* View Counter */
    .view-counter {
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.06) 0%, rgba(124, 58, 237, 0.06) 100%);
      border: 1px solid rgba(0, 212, 255, 0.12);
      border-radius: 12px;
      animation: fadeInUp 0.6s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .counter-inner {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .counter-icon {
      font-size: 1.75rem;
      animation: float 3s ease-in-out infinite;
    }

    .counter-value {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: countUp 0.6s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .counter-label {
      font-size: 0.9rem;
      color: #94a3b8;
      margin-left: 0.35rem;
    }

    .counter-hint {
      font-size: 0.75rem;
      color: #4a5568;
      margin-top: 0.5rem;
    }

    /* Detail Skeleton */
    .detail-skeleton {
      padding: 2rem 0;
    }

    /* Error State */
    .error-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }

    @media (max-width: 768px) {
      .detail-card {
        padding: 1.5rem;
      }
      .detail-title {
        font-size: 1.5rem;
      }
      .detail-header {
        flex-direction: column;
      }
    }
  `]
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'Invalid prompt ID.';
      this.loading = false;
      return;
    }

    this.promptService.getPrompt(id).subscribe({
      next: (data) => {
        this.prompt = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.status === 404 ? 'Prompt not found.' : 'Failed to load prompt.';
        this.loading = false;
      }
    });
  }

  getComplexityClass(complexity: number): string {
    if (complexity <= 3) return 'badge-low';
    if (complexity <= 7) return 'badge-medium';
    return 'badge-high';
  }
}
