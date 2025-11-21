import { Provider, ProviderId } from '../types';
import { chatgptProvider } from './chatgpt';
import { geminiProvider } from './gemini';
import { claudeProvider } from './claude';
import { kimiProvider } from './kimi';
import { grokProvider } from './grok';
import { deepseekProvider } from './deepseek';

export const PROVIDERS: Record<ProviderId, Provider> = {
    chatgpt: chatgptProvider,
    gemini: geminiProvider,
    claude: claudeProvider,
    kimi: kimiProvider,
    grok: grokProvider,
    deepseek: deepseekProvider
};

