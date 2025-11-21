import { AppState } from '../types';

export async function loadState(): Promise<AppState> {
    const stored = await chrome.storage.local.get(['tokens', 'selectedModels']);
    return {
        tokens: stored.tokens || {},
        responses: {},
        selectedModels: stored.selectedModels || {}
    };
}

export async function saveTokens(tokens: Record<string, string>): Promise<void> {
    await chrome.storage.local.set({ tokens });
}

export async function saveSelectedModels(selectedModels: Record<string, string>): Promise<void> {
    await chrome.storage.local.set({ selectedModels });
}

