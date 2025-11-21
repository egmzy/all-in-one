import { Provider, ProviderId, Model } from '../types';
import { PROVIDERS } from '../providers';

export async function fetchAndPopulateModels(
    providerId: ProviderId,
    token: string
): Promise<Model[]> {
    const provider = PROVIDERS[providerId];
    
    if (!provider.listModelsUrl || !token) {
        return provider.fallbackModels;
    }

    try {
        const url = typeof provider.listModelsUrl === 'function' 
            ? provider.listModelsUrl(token) 
            : provider.listModelsUrl;
        
        const headers: Record<string, string> = providerId === 'claude' 
            ? { 'x-api-key': token, 'anthropic-version': '2023-06-01' }
            : { 'Authorization': `Bearer ${token}` };

        const res = await fetch(url, { headers });
        
        if (!res.ok) {
            console.warn(`[${providerId}] Failed to fetch models, using fallback`);
            return provider.fallbackModels;
        }

        const data = await res.json();
        const models = provider.parseModels ? provider.parseModels(data) : provider.fallbackModels;
        
        if (models.length > 0) {
            provider.models = models;
            return models;
        }
        
        return provider.fallbackModels;
    } catch (err) {
        console.error(`[${providerId}] Error fetching models:`, err);
        return provider.fallbackModels;
    }
}

export async function fetchResponse(
    providerId: ProviderId,
    prompt: string,
    token: string,
    selectedModel: string
): Promise<string> {
    const provider = PROVIDERS[providerId];
    
    // Add instruction for concise responses
    const enhancedPrompt = `${prompt}\n\nBe concise, straight to the point, answer directly no fancy words.`;
    
    // Handle URL generation (some need model in URL)
    const url = typeof provider.url === 'function' 
        ? provider.url(token, selectedModel) 
        : provider.url;
    
    const headers = provider.headers(token);
    const body = JSON.stringify(provider.body(selectedModel, enhancedPrompt));

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API Error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return provider.parseResponse(data);
}

