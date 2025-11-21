import { ProviderId } from '../types';
import { PROVIDERS } from '../providers';
import { PROVIDER_COLORS } from '../config/colors';

export function displayFormattedSummary(
    rawSummary: string,
    providersWithResponses: ProviderId[],
    responses: Record<string, string>
): void {
    const summaryContent = document.getElementById('summary-content')!;
    
    // Clear the content
    summaryContent.innerHTML = '';
    summaryContent.style.color = '';
    
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
    const summaryText = verdictStartIndex > 0 
        ? lines.slice(0, verdictStartIndex).join('\n') 
        : rawSummary;
    
    // Parse each provider's summary
    providersWithResponses.forEach(pid => {
        const providerInfo = PROVIDER_COLORS[pid];
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
            const originalResponse = responses[pid];
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

