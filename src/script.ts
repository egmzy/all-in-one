import { AppState, ProviderId } from './types';
import { PROVIDERS } from './providers';
import { loadState, saveTokens, saveSelectedModels } from './utils/storage';
import { fetchAndPopulateModels, fetchResponse } from './utils/api';
import { parseMarkdownToHTML } from './utils/markdown';
import { populateModelSelect, updatePaneState } from './ui/pane';
import { displayFormattedSummary } from './ui/summary';

// Global state
const state: AppState = {
    tokens: {},
    responses: {},
    selectedModels: {}
};

let currentTokenProvider: ProviderId | null = null;

// DOM Elements
const sendBtn = document.getElementById('send-btn')!;
const summarizeBtn = document.getElementById('summarize-btn')!;
const mainPrompt = document.getElementById('main-prompt') as HTMLInputElement;
const tokenModal = document.getElementById('token-modal')!;
const tokenInput = document.getElementById('token-input') as HTMLInputElement;
const saveTokenBtn = document.getElementById('save-token-btn')!;
const cancelTokenBtn = document.getElementById('cancel-token-btn')!;
const summaryModal = document.getElementById('summary-modal')!;
const closeSummaryBtn = document.getElementById('close-summary-btn')!;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Load saved state
    const savedState = await loadState();
    state.tokens = savedState.tokens;
    state.selectedModels = savedState.selectedModels;

    // Init panes
    for (const providerId of Object.keys(PROVIDERS) as ProviderId[]) {
        const pane = document.getElementById(`pane-${providerId}`)!;
        const select = pane.querySelector('.model-select') as HTMLSelectElement;
        
        // If token exists, fetch models dynamically
        if (state.tokens[providerId]) {
            const models = await fetchAndPopulateModels(providerId, state.tokens[providerId]);
            populateModelSelect(providerId, models, state.selectedModels[providerId]);
        } else {
            // Use fallback models
            populateModelSelect(providerId, PROVIDERS[providerId].fallbackModels);
        }

        // Listen for model changes
        select.addEventListener('change', async (e) => {
            state.selectedModels[providerId] = (e.target as HTMLSelectElement).value;
            await saveSelectedModels(state.selectedModels);
        });

        updatePaneState(providerId, !!state.tokens[providerId]);
        
        // Event listeners for pane buttons
        const enterBtn = pane.querySelector('.enter-token-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => openTokenModal(providerId));
        }
        
        const changeBtn = pane.querySelector('.change-token-btn');
        if (changeBtn) {
            changeBtn.addEventListener('click', () => openTokenModal(providerId));
        }

        const deleteBtn = pane.querySelector('.delete-token-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteToken(providerId));
        }
    }

    // Global listeners
    sendBtn.addEventListener('click', sendToAll);
    summarizeBtn.addEventListener('click', summarizeAll);
    
    saveTokenBtn.addEventListener('click', saveToken);
    cancelTokenBtn.addEventListener('click', closeTokenModal);
    closeSummaryBtn.addEventListener('click', () => {
        summaryModal.classList.add('hidden');
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === tokenModal) closeTokenModal();
        if (e.target === summaryModal) summaryModal.classList.add('hidden');
    });
}

function openTokenModal(providerId: ProviderId) {
    currentTokenProvider = providerId;
    tokenInput.value = state.tokens[providerId] || '';
    document.getElementById('token-modal-title')!.textContent = `Enter ${PROVIDERS[providerId].name} Token`;
    tokenModal.classList.remove('hidden');
    tokenInput.focus();
}

function closeTokenModal() {
    tokenModal.classList.add('hidden');
    currentTokenProvider = null;
    tokenInput.value = '';
}

async function saveToken() {
    if (!currentTokenProvider) return;
    
    const token = tokenInput.value.trim();
    if (token) {
        state.tokens[currentTokenProvider] = token;
        await saveTokens(state.tokens);
        
        // Fetch available models for this provider
        const models = await fetchAndPopulateModels(currentTokenProvider, token);
        populateModelSelect(currentTokenProvider, models, state.selectedModels[currentTokenProvider]);
        
        updatePaneState(currentTokenProvider, true);
        closeTokenModal();
    }
}

async function deleteToken(providerId: ProviderId) {
    delete state.tokens[providerId];
    await saveTokens(state.tokens);
    updatePaneState(providerId, false);
    
    // Clear response
    const pane = document.getElementById(`pane-${providerId}`)!;
    const responseText = pane.querySelector('.response-text') as HTMLElement;
    responseText.textContent = '';
    state.responses[providerId] = '';
    
    checkSummarizeability();
}

async function sendToAll() {
    const prompt = mainPrompt.value.trim();
    if (!prompt) return;

    // Reset responses
    state.responses = {};
    (summarizeBtn as HTMLButtonElement).disabled = true;

    const providers = (Object.keys(PROVIDERS) as ProviderId[]).filter(pid => !!state.tokens[pid]);
    
    if (providers.length === 0) {
        alert('Please enter at least one API token.');
        return;
    }

    providers.forEach(pid => {
        handleFetchResponse(pid, prompt);
    });
}

async function handleFetchResponse(providerId: ProviderId, prompt: string) {
    const pane = document.getElementById(`pane-${providerId}`)!;
    const outputDiv = pane.querySelector('.response-text') as HTMLElement;
    const placeholder = pane.querySelector('.placeholder') as HTMLElement;
    
    placeholder.textContent = 'Thinking...';
    outputDiv.textContent = '';

    try {
        const token = state.tokens[providerId];
        const selectedModel = state.selectedModels[providerId] || PROVIDERS[providerId].defaultModel;
        
        const answer = await fetchResponse(providerId, prompt, token, selectedModel);
        
        outputDiv.innerHTML = parseMarkdownToHTML(answer);
        outputDiv.style.color = '';
        state.responses[providerId] = answer;
        placeholder.textContent = '';
        
        checkSummarizeability();

    } catch (err: any) {
        console.error(`[${providerId}] Error:`, err);
        const errorMessage = `❌ Error: ${err.message}`;
        outputDiv.textContent = errorMessage;
        outputDiv.style.color = '#ef4444';
        placeholder.textContent = '';
    }
}

function checkSummarizeability() {
    const validResponses = Object.keys(state.responses).filter(k => !!state.responses[k]);
    (summarizeBtn as HTMLButtonElement).disabled = validResponses.length === 0;
}

async function summarizeAll() {
    const providersWithResponses = (Object.keys(state.responses) as ProviderId[])
        .filter(k => !!state.responses[k]);
    
    if (providersWithResponses.length === 0) return;

    summaryModal.classList.remove('hidden');
    const summaryContent = document.getElementById('summary-content')!;
    summaryContent.textContent = 'Generating summary...';

    const originalPrompt = mainPrompt.value;
    
    let combinedAnswers = '';
    providersWithResponses.forEach(pid => {
        combinedAnswers += `\n[${PROVIDERS[pid].name.toUpperCase()}]:\n${state.responses[pid]}\n\n`;
    });

    const summaryPrompt = `
User Question: ${originalPrompt}

Here are responses from multiple AI models:
${combinedAnswers}

Your task:
1. For EACH AI model listed above, write ONE concise sentence summarizing their answer. Format it EXACTLY as: "${PROVIDERS[providersWithResponses[0]].name}: [one sentence summary]"
2. After listing all summaries, write "FINAL VERDICT:" on a new line
3. Then provide a brief final answer synthesizing all responses

Be direct and concise. Each summary should be on its own line.
    `;

    // Pick a provider to do the summary
    const priority: ProviderId[] = ['chatgpt', 'gemini', 'claude', 'kimi', 'grok', 'deepseek'];
    const summarizerId = priority.find(pid => !!state.tokens[pid]);

    if (!summarizerId) {
        summaryContent.textContent = 'Error: No available provider to generate summary.';
        return;
    }

    try {
        const token = state.tokens[summarizerId];
        const selectedModel = state.selectedModels[summarizerId] || PROVIDERS[summarizerId].defaultModel;
        
        const summary = await fetchResponse(summarizerId, summaryPrompt, token, selectedModel);
        
        // Format and display the summary with proper structure
        displayFormattedSummary(summary, providersWithResponses, state.responses);

    } catch (err: any) {
        console.error('[Summary] Error:', err);
        summaryContent.innerHTML = `<div style="color: #ef4444;">❌ Error generating summary: ${err.message}</div>`;
    }
}

