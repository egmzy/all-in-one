import { Provider } from '../types';

export const claudeProvider: Provider = {
    name: 'Claude',
    url: 'https://api.anthropic.com/v1/messages',
    listModelsUrl: 'https://api.anthropic.com/v1/models',
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: [],
    fallbackModels: [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (New)' },
        { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
    ],
    parseModels: (data) => {
        return data.data.map((m: any) => ({ id: m.id, name: m.display_name || m.id }));
    },
    headers: (token) => ({
        'x-api-key': token,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
    }),
    body: (model, prompt) => ({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
    }),
    parseResponse: (data) => data.content?.[0]?.text || 'Error parsing response'
};

