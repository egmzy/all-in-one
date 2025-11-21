/**
 * Simple Markdown to HTML parser
 * Supports: headers, bold, italic, lists, code blocks, inline code, links
 */
export function parseMarkdownToHTML(markdown: string): string {
    let html = markdown;
    
    const escapeHTML = (str: string): string => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
    
    const lines = html.split('\n');
    const processed: string[] = [];
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Headers (###, ##, #)
        if (line.match(/^#{1,6}\s/)) {
            const level = line.match(/^#+/)![0].length;
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

