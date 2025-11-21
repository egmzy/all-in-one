// Type definitions for the application

export interface Model {
    id: string;
    name: string;
}

export interface Provider {
    name: string;
    url: string | ((token: string, model?: string) => string);
    listModelsUrl?: string | ((token: string) => string);
    defaultModel: string;
    models: Model[];
    fallbackModels: Model[];
    headers: (token: string) => Record<string, string>;
    body: (model: string, prompt: string) => any;
    parseResponse: (data: any) => string;
    parseModels?: (data: any) => Model[];
}

export interface AppState {
    tokens: Record<string, string>;
    responses: Record<string, string>;
    selectedModels: Record<string, string>;
}

export interface ProviderColors {
    border: string;
    bg: string;
    name: string;
}

export type ProviderId = 'chatgpt' | 'gemini' | 'claude' | 'kimi' | 'grok' | 'deepseek';

