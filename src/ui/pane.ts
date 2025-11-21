import { ProviderId, Model } from '../types';
import { PROVIDERS } from '../providers';

export function populateModelSelect(
    providerId: ProviderId,
    models: Model[],
    selectedModel?: string
): void {
    const pane = document.getElementById(`pane-${providerId}`)!;
    const select = pane.querySelector('.model-select') as HTMLSelectElement;
    const provider = PROVIDERS[providerId];
    
    // Clear existing options
    select.innerHTML = '';
    
    // Populate with new models
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.name;
        select.appendChild(option);
    });

    // Set selected model
    if (selectedModel && models.find(m => m.id === selectedModel)) {
        select.value = selectedModel;
    } else {
        select.value = provider.defaultModel;
    }
}

export function updatePaneState(
    providerId: ProviderId,
    hasToken: boolean
): void {
    const pane = document.getElementById(`pane-${providerId}`)!;
    
    const controls = pane.querySelector('.pane-controls')!;
    const tokenPrompt = pane.querySelector('.token-prompt')!;
    const responseArea = pane.querySelector('.response-area')!;

    if (hasToken) {
        controls.classList.remove('hidden');
        tokenPrompt.classList.add('hidden');
        responseArea.classList.remove('hidden');
    } else {
        controls.classList.add('hidden');
        tokenPrompt.classList.remove('hidden');
        responseArea.classList.add('hidden');
        // Clear response if token deleted
        const responseText = pane.querySelector('.response-text') as HTMLElement;
        responseText.textContent = '';
    }
}

