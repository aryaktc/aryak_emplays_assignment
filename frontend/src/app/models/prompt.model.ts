/** Prompt model interfaces */

export interface Prompt {
  id: number;
  title: string;
  content?: string;
  complexity: number;
  created_at: string;
  view_count?: number;
  tags: string[];
}

export interface CreatePromptPayload {
  title: string;
  content: string;
  complexity: number;
  tags?: string;
}

export interface ApiError {
  error?: string;
  errors?: { [key: string]: string };
}

export interface AuthUser {
  id: number;
  username: string;
}

export interface AuthResponse {
  message: string;
  user?: AuthUser;
  authenticated?: boolean;
}
