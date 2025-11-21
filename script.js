const PROVIDERS = {
    chatgpt: {
        name: 'ChatGPT',
        url: 'https://api.openai.com/v1/chat/completions',
        listModelsUrl: 'https://api.openai.com/v1/models',
        defaultModel: 'gpt-4o',
        models: [], // Will be populated dynamically
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
            // Filter for chat completion models only
            return data.data
                .filter(m => m.id.includes('gpt') || m.id.includes('o1'))
                .map(m => ({ id: m.id, name: m.id }));
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
    },
    gemini: {
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
            // Filter for generateContent-capable models
            return data.models
                .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                .map(m => ({ id: m.name.replace('models/', ''), name: m.displayName || m.name }));
        },
        headers: (token) => ({
            'Content-Type': 'application/json'
        }),
        body: (model, prompt) => ({
            contents: [{ parts: [{ text: prompt }] }]
        }),
        parseResponse: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text || 'Error parsing response'
    },
    claude: {
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
            return data.data.map(m => ({ id: m.id, name: m.display_name || m.id }));
        },
        headers: (token) => ({
            'x-api-key': token,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'anthropic-dangerous-direct-browser-access': 'true' // Required for CORS in browser
        }),
        body: (model, prompt) => ({
            model,
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
        }),
        parseResponse: (data) => data.content?.[0]?.text || 'Error parsing response'
    },
    kimi: {
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
            return data.data.map(m => ({ id: m.id, name: m.id }));
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
    },
    grok: {
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
            return data.data.map(m => ({ id: m.id, name: m.id }));
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
    },
    deepseek: {
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
            return data.data.map(m => ({ id: m.id, name: m.id }));
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
    }
};

const state = {
    tokens: {},
    responses: {},
    selectedModels: {}
};

// DOM Elements
const sendBtn = document.getElementById('send-btn');
const summarizeBtn = document.getElementById('summarize-btn');
const mainPrompt = document.getElementById('main-prompt');
const tokenModal = document.getElementById('token-modal');
const tokenInput = document.getElementById('token-input');
const saveTokenBtn = document.getElementById('save-token-btn');
const cancelTokenBtn = document.getElementById('cancel-token-btn');
const summaryModal = document.getElementById('summary-modal');
const summaryContent = document.getElementById('summary-content');
const closeSummaryBtn = document.getElementById('close-summary-btn');

let currentTokenProvider = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Load tokens and selected models
    const stored = await chrome.storage.local.get(['tokens', 'selectedModels']);
    if (stored.tokens) {
        state.tokens = stored.tokens;
    }
    if (stored.selectedModels) {
        state.selectedModels = stored.selectedModels;
    }

    // Init panes
    Object.keys(PROVIDERS).forEach(async (providerId) => {
        const pane = document.getElementById(`pane-${providerId}`);
        const select = pane.querySelector('.model-select');
        const provider = PROVIDERS[providerId];
        
        // If token exists, fetch models dynamically
        if (state.tokens[providerId]) {
            await fetchAndPopulateModels(providerId);
        } else {
            // Use fallback models
            populateModelSelect(providerId, provider.fallbackModels);
        }

        // Listen for model changes
        select.addEventListener('change', async (e) => {
            state.selectedModels[providerId] = e.target.value;
            await chrome.storage.local.set({ selectedModels: state.selectedModels });
        });

        updatePaneState(providerId);
        
        // Event listeners for pane buttons
        // Note: 'pane' is already defined above in this loop
        
        // Fix: Use .enter-token-btn class selector directly on the button element found in the pane
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
    });

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

function updatePaneState(providerId) {
    const pane = document.getElementById(`pane-${providerId}`);
    const hasToken = !!state.tokens[providerId];
    
    const controls = pane.querySelector('.pane-controls');
    const tokenPrompt = pane.querySelector('.token-prompt');
    const responseArea = pane.querySelector('.response-area');

    if (hasToken) {
        controls.classList.remove('hidden');
        tokenPrompt.classList.add('hidden');
        responseArea.classList.remove('hidden');
    } else {
        controls.classList.add('hidden');
        tokenPrompt.classList.remove('hidden');
        responseArea.classList.add('hidden');
        // Clear response if token deleted
        pane.querySelector('.response-text').textContent = '';
        state.responses[providerId] = null;
    }
    
    checkSummarizeability();
}

function openTokenModal(providerId) {
    currentTokenProvider = providerId;
    tokenInput.value = state.tokens[providerId] || '';
    document.getElementById('token-modal-title').textContent = `Enter ${PROVIDERS[providerId].name} Token`;
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
        await chrome.storage.local.set({ tokens: state.tokens });
        
        // Fetch available models for this provider
        await fetchAndPopulateModels(currentTokenProvider);
        
        updatePaneState(currentTokenProvider);
        closeTokenModal();
    }
}

async function fetchAndPopulateModels(providerId) {
    const provider = PROVIDERS[providerId];
    const token = state.tokens[providerId];
    
    if (!provider.listModelsUrl || !token) {
        // Use fallback models
        populateModelSelect(providerId, provider.fallbackModels);
        return;
    }

    try {
        const url = typeof provider.listModelsUrl === 'function' 
            ? provider.listModelsUrl(token) 
            : provider.listModelsUrl;
        
        const headers = providerId === 'claude' 
            ? { 'x-api-key': token, 'anthropic-version': '2023-06-01' }
            : { 'Authorization': `Bearer ${token}` };

        const res = await fetch(url, { headers });
        
        if (!res.ok) {
            console.warn(`[${providerId}] Failed to fetch models, using fallback`);
            populateModelSelect(providerId, provider.fallbackModels);
            return;
        }

        const data = await res.json();
        const models = provider.parseModels(data);
        
        if (models.length > 0) {
            provider.models = models;
            populateModelSelect(providerId, models);
        } else {
            populateModelSelect(providerId, provider.fallbackModels);
        }
    } catch (err) {
        console.error(`[${providerId}] Error fetching models:`, err);
        populateModelSelect(providerId, provider.fallbackModels);
    }
}

function populateModelSelect(providerId, models) {
    const pane = document.getElementById(`pane-${providerId}`);
    const select = pane.querySelector('.model-select');
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
    if (state.selectedModels[providerId] && models.find(m => m.id === state.selectedModels[providerId])) {
        select.value = state.selectedModels[providerId];
    } else {
        select.value = provider.defaultModel;
        state.selectedModels[providerId] = provider.defaultModel;
    }
}

async function deleteToken(providerId) {
    delete state.tokens[providerId];
    await chrome.storage.local.set({ tokens: state.tokens });
    updatePaneState(providerId);
}

async function sendToAll() {
    const prompt = mainPrompt.value.trim();
    if (!prompt) return;

    // Reset responses
    state.responses = {};
    summarizeBtn.disabled = true;

    const providers = Object.keys(PROVIDERS).filter(pid => !!state.tokens[pid]);
    
    if (providers.length === 0) {
        alert('Please enter at least one API token.');
        return;
    }

    providers.forEach(pid => {
        fetchResponse(pid, prompt);
    });
}

async function fetchResponse(providerId, prompt) {
    const provider = PROVIDERS[providerId];
    const pane = document.getElementById(`pane-${providerId}`);
    const outputDiv = pane.querySelector('.response-text');
    const placeholder = pane.querySelector('.placeholder');
    
    placeholder.textContent = 'Thinking...';
    outputDiv.textContent = '';

    try {
        const token = state.tokens[providerId];
        const selectedModel = state.selectedModels[providerId] || provider.defaultModel;
        
        // Add instruction for concise responses
        const enhancedPrompt = `${prompt}\n\nBe concise, straight to the point, answer directly no fancy words.`;
        
        // Handle URL generation (some need model in URL)
        const url = typeof provider.url === 'function' ? provider.url(token, selectedModel) : provider.url;
        
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
        const answer = provider.parseResponse(data);
        
        outputDiv.innerHTML = parseMarkdownToHTML(answer);
        outputDiv.style.color = ''; // Reset color to default
        state.responses[providerId] = answer;
        placeholder.textContent = ''; // Hide placeholder
        
        checkSummarizeability();

    } catch (err) {
        console.error(`[${providerId}] Error:`, err);
        const errorMessage = `❌ Error: ${err.message}`;
        outputDiv.textContent = errorMessage;
        outputDiv.style.color = '#ef4444'; // Red color for errors
        placeholder.textContent = '';
        // Don't set state.responses[providerId] so it won't be included in summary
    }
}

function checkSummarizeability() {
    // Enable summarize if we have at least one valid response
    const validResponses = Object.keys(state.responses).filter(k => !!state.responses[k]);
    summarizeBtn.disabled = validResponses.length === 0;
}

async function summarizeAll() {
    const providersWithResponses = Object.keys(state.responses).filter(k => !!state.responses[k]);
    if (providersWithResponses.length === 0) return;

    summaryModal.classList.remove('hidden');
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

    // Pick a provider to do the summary. Prefer ChatGPT or Gemini for speed/quality, or just the first available.
    // Priority: ChatGPT -> Gemini -> Claude -> Kimi -> Grok -> DeepSeek
    const priority = ['chatgpt', 'gemini', 'claude', 'kimi', 'grok', 'deepseek'];
    const summarizerId = priority.find(pid => !!state.tokens[pid]);

    if (!summarizerId) {
        summaryContent.textContent = 'Error: No available provider to generate summary.';
        return;
    }

    try {
        const provider = PROVIDERS[summarizerId];
        const token = state.tokens[summarizerId];
        const selectedModel = state.selectedModels[summarizerId] || provider.defaultModel;
        
        const url = typeof provider.url === 'function' ? provider.url(token, selectedModel) : provider.url;
        const headers = provider.headers(token);
        const body = JSON.stringify(provider.body(selectedModel, summaryPrompt));

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        if (!res.ok) {
             throw new Error(`API Error ${res.status}`);
        }

        const data = await res.json();
        const summary = provider.parseResponse(data);
        
        // Format and display the summary with proper structure
        displayFormattedSummary(summary, providersWithResponses);

    } catch (err) {
        console.error('[Summary] Error:', err);
        summaryContent.innerHTML = `<div style="color: #ef4444;">❌ Error generating summary: ${err.message}</div>`;
    }
}

function displayFormattedSummary(rawSummary, providersWithResponses) {
    // Clear the content
    summaryContent.innerHTML = '';
    summaryContent.style.color = ''; // Reset color
    
    // Define colors for each provider
    const providerColors = {
        'chatgpt': { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', name: '🤖 ChatGPT' },
        'gemini': { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', name: '✨ Gemini' },
        'claude': { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', name: '🧠 Claude' },
        'kimi': { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', name: '🌙 Kimi' },
        'grok': { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', name: '🚀 Grok' },
        'deepseek': { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', name: '🔍 DeepSeek' }
    };
    
    // Parse the summary
    const lines = rawSummary.split('\n');
    
    // Create a structured display
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 24px;';
    
    // Section 1: Individual Summaries
    const summariesSection = document.createElement('div');
    summariesSection.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
    
    const summariesTitle = document.createElement('h4');
    summariesTitle.textContent = '📊 Individual Summaries';
    summariesTitle.style.cssText = 'margin: 0; font-size: 16px; font-weight: 600; color: #a1a1aa; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-bottom: 12px;';
    summariesSection.appendChild(summariesTitle);
    
    // Find verdict section
    let verdictStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes('final verdict')) {
            verdictStartIndex = i;
            break;
        }
    }
    
    // Extract summaries (everything before verdict)
    const summaryText = verdictStartIndex > 0 ? lines.slice(0, verdictStartIndex).join('\n') : rawSummary;
    
    // Parse each provider's summary
    providersWithResponses.forEach(pid => {
        const providerInfo = providerColors[pid] || { border: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', name: PROVIDERS[pid].name };
        const providerName = PROVIDERS[pid].name;
        
        // Find the line that mentions this provider
        const regex = new RegExp(`${providerName}:?\\s*(.+?)(?=\\n|$)`, 'i');
        const match = summaryText.match(regex);
        
        const summaryItem = document.createElement('div');
        summaryItem.style.cssText = `
            padding: 14px 16px;
            background-color: ${providerInfo.bg};
            border-radius: 8px;
            border-left: 4px solid ${providerInfo.border};
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        `;
        
        const header = document.createElement('div');
        header.style.cssText = `font-weight: 600; font-size: 13px; margin-bottom: 8px; color: ${providerInfo.border};`;
        header.textContent = providerInfo.name;
        summaryItem.appendChild(header);
        
        const content = document.createElement('div');
        content.style.cssText = 'color: #e4e4e7; line-height: 1.7; font-size: 14px;';
        
        if (match && match[1]) {
            content.textContent = match[1].trim();
        } else {
            // Fallback: show a portion of the original response
            const originalResponse = state.responses[pid];
            content.textContent = originalResponse.substring(0, 150) + (originalResponse.length > 150 ? '...' : '');
        }
        
        summaryItem.appendChild(content);
        summariesSection.appendChild(summaryItem);
    });
    
    container.appendChild(summariesSection);
    
    // Section 2: Final Verdict
    const verdictSection = document.createElement('div');
    verdictSection.style.cssText = 'display: flex; flex-direction: column; gap: 8px; padding-top: 20px; border-top: 2px solid #3f3f46; margin-top: 8px;';
    
    const verdictTitle = document.createElement('h4');
    verdictTitle.textContent = '✨ Final Verdict';
    verdictTitle.style.cssText = 'margin: 0; font-size: 18px; font-weight: 700; color: #10b981; margin-bottom: 12px;';
    verdictSection.appendChild(verdictTitle);
    
    const verdictText = document.createElement('div');
    verdictText.style.cssText = `
        padding: 20px;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
        border-radius: 10px;
        font-size: 15px;
        line-height: 1.8;
        border: 1px solid #3f3f46;
        color: #f3f4f6;
        font-weight: 500;
    `;
    
    if (verdictStartIndex > 0) {
        // Get everything after "FINAL VERDICT:"
        const verdictLines = lines.slice(verdictStartIndex + 1)
            .filter(l => l.trim())
            .join('\n')
            .trim();
        verdictText.textContent = verdictLines || 'No verdict provided';
    } else {
        // Fallback: show the entire summary
        verdictText.textContent = rawSummary;
    }
    
    verdictSection.appendChild(verdictText);
    container.appendChild(verdictSection);
    
    summaryContent.appendChild(container);
}

// Simple Markdown to HTML parser
function parseMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Escape HTML to prevent XSS
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
    
    // Process line by line for better control
    const lines = html.split('\n');
    const processed = [];
    let inList = false;
    let listType = null;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Headers (###, ##, #)
        if (line.match(/^#{1,6}\s/)) {
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s*/, '').trim();
            processed.push(`<h${level} style="margin: 16px 0 8px 0; font-weight: 600; color: #e4e4e7;">${escapeHTML(text)}</h${level}>`);
            continue;
        }
        
        // Bold (**text** or __text__)
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600; color: #f3f4f6;">$1</strong>');
        line = line.replace(/__(.+?)__/g, '<strong style="font-weight: 600; color: #f3f4f6;">$1</strong>');
        
        // Italic (*text* or _text_)
        line = line.replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>');
        line = line.replace(/_(.+?)_/g, '<em style="font-style: italic;">$1</em>');
        
        // Unordered list (-, *, +)
        if (line.match(/^[\s]*[-*+]\s/)) {
            if (!inList || listType !== 'ul') {
                if (inList) processed.push(`</${listType}>`);
                processed.push('<ul style="margin: 8px 0; padding-left: 24px; list-style-type: disc;">');
                inList = true;
                listType = 'ul';
            }
            const text = line.replace(/^[\s]*[-*+]\s/, '').trim();
            processed.push(`<li style="margin: 4px 0; line-height: 1.6;">${text}</li>`);
            continue;
        }
        
        // Ordered list (1., 2., etc)
        if (line.match(/^[\s]*\d+\.\s/)) {
            if (!inList || listType !== 'ol') {
                if (inList) processed.push(`</${listType}>`);
                processed.push('<ol style="margin: 8px 0; padding-left: 24px;">');
                inList = true;
                listType = 'ol';
            }
            const text = line.replace(/^[\s]*\d+\.\s/, '').trim();
            processed.push(`<li style="margin: 4px 0; line-height: 1.6;">${text}</li>`);
            continue;
        }
        
        // Close list if we're in one and hit a non-list line
        if (inList && !line.match(/^[\s]*[-*+\d]/)) {
            processed.push(`</${listType}>`);
            inList = false;
            listType = null;
        }
        
        // Code blocks (```code```)
        if (line.trim().startsWith('```')) {
            processed.push('<pre style="background: #27272a; padding: 12px; border-radius: 6px; overflow-x: auto; margin: 8px 0;"><code>');
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                processed.push(escapeHTML(lines[i]) + '\n');
                i++;
            }
            processed.push('</code></pre>');
            continue;
        }
        
        // Inline code (`code`)
        line = line.replace(/`([^`]+)`/g, '<code style="background: #27272a; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">$1</code>');
        
        // Links [text](url)
        line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: underline;" target="_blank">$1</a>');
        
        // Empty lines = paragraph breaks
        if (line.trim() === '') {
            if (processed.length > 0 && !processed[processed.length - 1].includes('<br>')) {
                processed.push('<br>');
            }
            continue;
        }
        
        // Regular text
        processed.push(`<p style="margin: 8px 0; line-height: 1.6;">${line}</p>`);
    }
    
    // Close any open list
    if (inList) {
        processed.push(`</${listType}>`);
    }
    
    return processed.join('');
}

