import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prompt, CreatePromptPayload } from '../models/prompt.model';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private readonly apiUrl = '/api/prompts/';

  constructor(private http: HttpClient) {}

  /** Fetch all prompts, optionally filtered by tag */
  getPrompts(tag?: string): Observable<Prompt[]> {
    let params = new HttpParams();
    if (tag) {
      params = params.set('tag', tag);
    }
    return this.http.get<Prompt[]>(this.apiUrl, { params });
  }

  /** Fetch a single prompt by ID (increments view count) */
  getPrompt(id: number): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}${id}/`);
  }

  /** Create a new prompt */
  createPrompt(data: CreatePromptPayload): Observable<Prompt> {
    return this.http.post<Prompt>(this.apiUrl, data);
  }

  /** Fetch all available tags */
  getTags(): Observable<string[]> {
    return this.http.get<string[]>('/api/tags/');
  }
}
