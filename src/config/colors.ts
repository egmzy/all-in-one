import { ProviderColors, ProviderId } from '../types';

export const PROVIDER_COLORS: Record<ProviderId, ProviderColors> = {
    chatgpt: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', name: '🤖 ChatGPT' },
    gemini: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', name: '✨ Gemini' },
    claude: { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', name: '🧠 Claude' },
    kimi: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', name: '🌙 Kimi' },
    grok: { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', name: '🚀 Grok' },
    deepseek: { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', name: '🔍 DeepSeek' }
};

