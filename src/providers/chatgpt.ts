import { Provider } from '../types';

export const chatgptProvider: Provider = {
    name: 'ChatGPT',
    url: 'https://api.openai.com/v1/chat/completions',
    listModelsUrl: 'https://api.openai.com/v1/models',
    defaultModel: 'gpt-4o',
    models: [],
    fallbackModels: [
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'o1-preview', name: 'o1 Preview' },
        { id: 'o1-mini', name: 'o1 Mini' }
    ],
    parseModels: (data) => {
        return data.data
            .filter((m: any) => m.id.includes('gpt') || m.id.includes('o1'))
            .map((m: any) => ({ id: m.id, name: m.id }));
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

