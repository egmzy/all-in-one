import { Provider } from '../types';

export const deepseekProvider: Provider = {
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/chat/completions',
    listModelsUrl: 'https://api.deepseek.com/models',
    defaultModel: 'deepseek-chat',
    models: [],
    fallbackModels: [
        { id: 'deepseek-chat', name: 'DeepSeek Chat' },
        { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)' },
        { id: 'deepseek-coder', name: 'DeepSeek Coder' }
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

