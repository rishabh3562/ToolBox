export interface GeminiConfig {
  model: string;
  apiKey: string;
}

export interface GeminiStreamResponse {
  text: string;
  done: boolean;
}

export interface GeminiError {
  message: string;
  code?: string;
}