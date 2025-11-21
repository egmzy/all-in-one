import { Provider } from '../types';

export const geminiProvider: Provider = {
    name: 'Gemini',
    url: (token, model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${token}`,
    listModelsUrl: (token) => `https://generativelanguage.googleapis.com/v1beta/models?key=${token}`,
    defaultModel: 'gemini-2.5-flash',
    models: [],
    fallbackModels: [
        { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
        { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
        { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite' }
    ],
    parseModels: (data) => {
        return data.models
            .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m: any) => ({ id: m.name.replace('models/', ''), name: m.displayName || m.name }));
    },
    headers: (token) => ({
        'Content-Type': 'application/json'
    }),
    body: (model, prompt) => ({
        contents: [{ parts: [{ text: prompt }] }]
    }),
    parseResponse: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text || 'Error parsing response'
};

