import { Provider } from '../types';

export const grokProvider: Provider = {
    name: 'Grok',
    url: 'https://api.x.ai/v1/chat/completions',
    listModelsUrl: 'https://api.x.ai/v1/models',
    defaultModel: 'grok-beta',
    models: [],
    fallbackModels: [
        { id: 'grok-beta', name: 'Grok Beta' },
        { id: 'grok-2-latest', name: 'Grok 2 Latest' },
        { id: 'grok-2-1212', name: 'Grok 2 (1212)' },
        { id: 'grok-2-vision-1212', name: 'Grok 2 Vision' }
    ],
    parseModels: (data) => {
        return data.data.map((m: any) => ({ id: m.id, name: m.id }));
    },
    headers: (token) => ({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }),
    body: (model, prompt) => ({
        model,
        messages: [{ role: 'user', content: prompt }]
    }),
    parseResponse: (data) => data.choices?.[0]?.message?.content || 'Error parsing response'
};

