import { Provider } from '../types';

export const kimiProvider: Provider = {
    name: 'Kimi',
    url: 'https://api.moonshot.ai/v1/chat/completions',
    listModelsUrl: 'https://api.moonshot.ai/v1/models',
    defaultModel: 'moonshot-v1-8k',
    models: [],
    fallbackModels: [
        { id: 'moonshot-v1-8k', name: 'Kimi v1 8k' },
        { id: 'moonshot-v1-32k', name: 'Kimi v1 32k' },
        { id: 'moonshot-v1-128k', name: 'Kimi v1 128k' },
        { id: 'moonshot-v1-auto', name: 'Kimi v1 Auto' }
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

