import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container page-enter">
      <!-- Hero Header -->
      <header class="list-header">
        <div class="header-content">
          <h1 class="page-title" id="prompt-list-title">
            <span class="title-accent">AI Prompt</span> Library
          </h1>
          <p class="page-subtitle">
            Curated collection of AI image generation prompts — explore, create, and organize.
          </p>
        </div>
        <a routerLink="/add-prompt" class="btn btn-primary" id="create-prompt-btn">
          <span>+</span> New Prompt
        </a>
      </header>

      <!-- Tag Filters -->
      <div class="tag-filters" *ngIf="tags.length > 0">
        <button
          class="tag-chip"
          [class.active]="!activeTag"
          (click)="filterByTag(undefined)"
          id="tag-filter-all">
          All
        </button>
        <button
          *ngFor="let tag of tags"
          class="tag-chip"
          [class.active]="activeTag === tag"
          (click)="filterByTag(tag)"
          [id]="'tag-filter-' + tag">
          {{ tag }}
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="prompt-grid">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="skeleton-card glass-card">
          <div class="loading-skeleton skeleton-title"></div>
          <div class="loading-skeleton skeleton-badge"></div>
          <div class="loading-skeleton skeleton-tags"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && prompts.length === 0" class="empty-state" id="empty-state">
        <div class="empty-state-icon">✦</div>
        <h2>No prompts yet</h2>
        <p>Create your first AI image generation prompt to get started.</p>
        <a routerLink="/add-prompt" class="btn btn-primary" style="margin-top: 1rem;">
          Create First Prompt
        </a>
      </div>

      <!-- Prompt Grid -->
      <div *ngIf="!loading && prompts.length > 0" class="prompt-grid" id="prompt-grid">
        <a
          *ngFor="let prompt of prompts; let i = index"
          [routerLink]="['/prompts', prompt.id]"
          class="prompt-card glass-card"
          [class]="'stagger-' + ((i % 6) + 1)"
          [id]="'prompt-card-' + prompt.id"
          [style.animation-delay.ms]="i * 60">

          <div class="card-header">
            <h2 class="card-title">{{ prompt.title }}</h2>
            <span
              class="badge"
              [ngClass]="getComplexityClass(prompt.complexity)">
              {{ prompt.complexity }}/10
            </span>
          </div>

          <div class="card-meta">
            <span class="meta-date">{{ prompt.created_at | date:'mediumDate' }}</span>
          </div>

          <div class="card-tags" *ngIf="prompt.tags && prompt.tags.length > 0">
            <span *ngFor="let tag of prompt.tags" class="card-tag">{{ tag }}</span>
          </div>

          <div class="card-arrow">→</div>
        </a>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-banner" id="error-banner">
        <span>⚠</span> {{ error }}
        <button class="btn btn-ghost" (click)="loadPrompts()">Retry</button>
      </div>
    </div>
  `,
  styles: [`
    .list-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 2.5rem 0 1.5rem;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.2;
      color: #f1f5f9;
    }

    .title-accent {
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      color: #64748b;
      font-size: 1rem;
      margin-top: 0.5rem;
      max-width: 500px;
    }

    /* Tag Filters */
    .tag-filters {
      display: flex;
      gap: 0.5rem;
      padding-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    /* Prompt Grid */
    .prompt-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem;
      padding-bottom: 3rem;
    }

    .prompt-card {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .prompt-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899);
      opacity: 0;
      transition: opacity 300ms ease;
    }

    .prompt-card:hover::before {
      opacity: 1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.4;
      color: #f1f5f9;
      flex: 1;
    }

    .card-meta {
      margin-bottom: 0.75rem;
    }

    .meta-date {
      font-size: 0.8rem;
      color: #64748b;
    }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: auto;
      padding-top: 0.75rem;
    }

    .card-tag {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.06);
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .card-arrow {
      position: absolute;
      bottom: 1.25rem;
      right: 1.25rem;
      font-size: 1.1rem;
      color: #64748b;
      opacity: 0;
      transform: translateX(-6px);
      transition: all 250ms ease;
    }

    .prompt-card:hover .card-arrow {
      opacity: 1;
      transform: translateX(0);
      color: #00d4ff;
    }

    /* Skeleton */
    .skeleton-card {
      padding: 1.5rem;
      min-height: 140px;
    }

    .skeleton-title {
      height: 20px;
      width: 70%;
      margin-bottom: 0.75rem;
    }

    .skeleton-badge {
      height: 24px;
      width: 50px;
      margin-bottom: 0.75rem;
    }

    .skeleton-tags {
      height: 16px;
      width: 40%;
    }

    /* Error */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 10px;
      color: #f87171;
      font-size: 0.9rem;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 1.75rem;
      }
      .prompt-grid {
        grid-template-columns: 1fr;
      }
      .list-header {
        flex-direction: column;
      }
    }
  `]
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  tags: string[] = [];
  activeTag?: string;
  loading = true;
  error: string | null = null;

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    this.loadPrompts();
    this.loadTags();
  }

  loadPrompts(): void {
    this.loading = true;
    this.error = null;
    this.promptService.getPrompts(this.activeTag).subscribe({
      next: (data) => {
        this.prompts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load prompts. Please check if the backend is running.';
        this.loading = false;
        console.error('Error loading prompts:', err);
      }
    });
  }

  loadTags(): void {
    this.promptService.getTags().subscribe({
      next: (tags) => this.tags = tags,
      error: () => {} // Tags are optional, fail silently
    });
  }

  filterByTag(tag?: string): void {
    this.activeTag = tag;
    this.loadPrompts();
  }

  getComplexityClass(complexity: number): string {
    if (complexity <= 3) return 'badge-low';
    if (complexity <= 7) return 'badge-medium';
    return 'badge-high';
  }
}
