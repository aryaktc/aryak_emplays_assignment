import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container page-enter">
      <header class="form-header">
        <a routerLink="/prompts" class="back-link">
          <span>←</span> Back to Library
        </a>
        <h1 class="page-title" id="add-prompt-title">
          <span class="title-accent">Create</span> New Prompt
        </h1>
        <p class="page-subtitle">Add a new AI image generation prompt to your library.</p>
      </header>

      <form
        [formGroup]="promptForm"
        (ngSubmit)="onSubmit()"
        class="prompt-form glass-card"
        id="add-prompt-form">

        <!-- Title -->
        <div class="form-group">
          <label class="form-label" for="title">Title</label>
          <input
            class="form-input"
            type="text"
            id="title"
            formControlName="title"
            placeholder="e.g., Cyberpunk City at Night"
            [class.ng-invalid]="promptForm.get('title')?.invalid"
            [class.ng-touched]="promptForm.get('title')?.touched">
          <span class="form-error"
            *ngIf="promptForm.get('title')?.touched && promptForm.get('title')?.hasError('required')">
            Title is required.
          </span>
          <span class="form-error"
            *ngIf="promptForm.get('title')?.touched && promptForm.get('title')?.hasError('minlength')">
            Title must be at least 3 characters.
          </span>
        </div>

        <!-- Content -->
        <div class="form-group">
          <label class="form-label" for="content">Prompt Content</label>
          <textarea
            class="form-textarea"
            id="content"
            formControlName="content"
            placeholder="Describe your AI image generation prompt in detail..."
            rows="5"
            [class.ng-invalid]="promptForm.get('content')?.invalid"
            [class.ng-touched]="promptForm.get('content')?.touched"></textarea>
          <span class="form-hint" *ngIf="promptForm.get('content')?.value">
            {{ promptForm.get('content')?.value?.length || 0 }} / 20 min characters
          </span>
          <span class="form-error"
            *ngIf="promptForm.get('content')?.touched && promptForm.get('content')?.hasError('required')">
            Content is required.
          </span>
          <span class="form-error"
            *ngIf="promptForm.get('content')?.touched && promptForm.get('content')?.hasError('minlength')">
            Content must be at least 20 characters.
          </span>
        </div>

        <!-- Complexity -->
        <div class="form-group">
          <label class="form-label" for="complexity">
            Complexity
            <span class="complexity-display" [ngClass]="getComplexityClass()">
              {{ promptForm.get('complexity')?.value }}/10
            </span>
          </label>
          <div class="complexity-slider-container">
            <input
              class="complexity-slider"
              type="range"
              id="complexity"
              formControlName="complexity"
              min="1"
              max="10"
              step="1">
            <div class="slider-labels">
              <span>Simple</span>
              <span>Complex</span>
            </div>
          </div>
          <span class="form-error"
            *ngIf="promptForm.get('complexity')?.touched && promptForm.get('complexity')?.hasError('min')">
            Complexity must be at least 1.
          </span>
          <span class="form-error"
            *ngIf="promptForm.get('complexity')?.touched && promptForm.get('complexity')?.hasError('max')">
            Complexity must not exceed 10.
          </span>
        </div>

        <!-- Tags (Bonus B) -->
        <div class="form-group">
          <label class="form-label" for="tags">Tags (optional)</label>
          <input
            class="form-input"
            type="text"
            id="tags"
            formControlName="tags"
            placeholder="e.g., cyberpunk, sci-fi, anime (comma-separated)">
          <span class="form-hint">Separate tags with commas</span>
        </div>

        <!-- Server Error -->
        <div *ngIf="serverError" class="server-error" id="server-error">
          <span>⚠</span> {{ serverError }}
        </div>

        <!-- Success Message -->
        <div *ngIf="success" class="success-message" id="success-message">
          <span>✓</span> Prompt created successfully! Redirecting...
        </div>

        <!-- Submit -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary submit-btn"
            [disabled]="promptForm.invalid || submitting"
            id="submit-prompt-btn">
            <span *ngIf="!submitting">✦ Create Prompt</span>
            <span *ngIf="submitting" class="spinner">Creating...</span>
          </button>
          <a routerLink="/prompts" class="btn btn-ghost">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-header {
      padding: 1.5rem 0 1.5rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 1rem;
      transition: color 200ms ease;
    }

    .back-link:hover {
      color: #00d4ff;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
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
      font-size: 0.95rem;
      margin-top: 0.4rem;
    }

    .prompt-form {
      padding: 2.5rem;
      margin-bottom: 3rem;
      max-width: 700px;
      animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    /* Complexity Slider */
    .complexity-display {
      margin-left: 0.5rem;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .complexity-slider-container {
      padding: 0.5rem 0;
    }

    .complexity-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
      outline: none;
      opacity: 0.8;
      transition: opacity 200ms ease;
    }

    .complexity-slider:hover {
      opacity: 1;
    }

    .complexity-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f1f5f9;
      border: 2px solid #00d4ff;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
    }

    .complexity-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f1f5f9;
      border: 2px solid #00d4ff;
      cursor: pointer;
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 0.35rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 0.75rem;
      padding-top: 0.5rem;
    }

    .submit-btn {
      min-width: 180px;
    }

    .spinner {
      animation: pulse 1.2s infinite;
    }

    /* Messages */
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

    .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 8px;
      color: #34d399;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      animation: fadeInUp 0.3s ease;
    }

    @media (max-width: 768px) {
      .prompt-form {
        padding: 1.5rem;
      }
      .page-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AddPromptComponent {
  promptForm: FormGroup;
  submitting = false;
  serverError: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      tags: [''],
    });
  }

  getComplexityClass(): string {
    const val = this.promptForm.get('complexity')?.value || 5;
    if (val <= 3) return 'badge-low';
    if (val <= 7) return 'badge-medium';
    return 'badge-high';
  }

  onSubmit(): void {
    if (this.promptForm.invalid) {
      this.promptForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.serverError = null;

    const payload = this.promptForm.value;
    this.promptService.createPrompt(payload).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/prompts']), 1200);
      },
      error: (err) => {
        this.submitting = false;
        if (err.error?.errors) {
          const msgs = Object.values(err.error.errors).join(' ');
          this.serverError = msgs;
        } else if (err.error?.error) {
          this.serverError = err.error.error;
        } else {
          this.serverError = 'Failed to create prompt. Please try again.';
        }
      }
    });
  }
}
