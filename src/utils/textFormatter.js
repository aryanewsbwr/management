/**
 * Text & Rich Content Formatter for Arya News Agency
 * Supports Rich HTML, WhatsApp Formatting (*bold*, _italic_, ~strike~),
 * Alignment, Underline, and Safe Content Sanitization.
 */

/**
 * Sanitizes HTML string to allow safe formatting tags while stripping dangerous elements.
 */
export function sanitizeRichHtml(html = '') {
  if (!html || typeof html !== 'string') return '';

  // In browser environment, use DOMParser for accurate and safe tree-based sanitization
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Allowed tags for news formatting
      const allowedTags = new Set([
        'P', 'B', 'STRONG', 'U', 'I', 'EM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
        'UL', 'OL', 'LI', 'BLOCKQUOTE', 'DIV', 'SPAN', 'BR', 'HR', 'FONT',
        'A', 'MARK', 'SUB', 'SUP', 'DEL', 'S'
      ]);

      const cleanNode = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toUpperCase();

          // If dangerous tag, remove completely
          if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON'].includes(tagName)) {
            node.remove();
            return;
          }

          // If not in allowed tags, unwrap (keep children)
          if (!allowedTags.has(tagName)) {
            while (node.firstChild) {
              node.parentNode.insertBefore(node.firstChild, node);
            }
            node.remove();
            return;
          }

          // Filter attributes: remove event handlers (on*), javascript: links, etc.
          const attrs = Array.from(node.attributes);
          for (const attr of attrs) {
            const name = attr.name.toLowerCase();
            const val = attr.value;

            if (name.startsWith('on') || (name === 'href' && val.toLowerCase().trim().startsWith('javascript:'))) {
              node.removeAttribute(attr.name);
            } else if (name === 'style') {
              // Only permit safe styling properties: text-align, text-decoration, font-weight, etc.
              const safeStyles = val
                .split(';')
                .map(s => s.trim())
                .filter(s => {
                  const prop = s.split(':')[0]?.trim().toLowerCase();
                  return ['text-align', 'text-decoration', 'font-weight', 'font-style', 'color', 'background-color', 'padding-left', 'margin-left', 'line-height'].includes(prop);
                })
                .join('; ');

              if (safeStyles) {
                node.setAttribute('style', safeStyles);
              } else {
                node.removeAttribute('style');
              }
            } else if (!['href', 'target', 'rel', 'class', 'align', 'dir'].includes(name)) {
              node.removeAttribute(attr.name);
            }
          }

          // Recursively clean children
          Array.from(node.childNodes).forEach(cleanNode);
        }
      };

      Array.from(doc.body.childNodes).forEach(cleanNode);
      return doc.body.innerHTML;
    } catch (e) {
      console.warn('DOMParser sanitize notice:', e);
    }
  }

  // Fallback regex sanitizer
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

/**
 * Converts WhatsApp formatting syntax (*bold*, _italic_, ~strike~) and linebreaks into clean HTML.
 */
export function formatWhatsAppAndMarkdown(text = '') {
  if (!text || typeof text !== 'string') return '';

  let res = text
    // Replace WhatsApp Bold: *text* (when not part of a math equation)
    .replace(/(^|[^\w*])\*([^\s*](?:[^*]*[^\s*])?)\*([^\w*]|$)/g, '$1<strong>$2</strong>$3')
    // Replace WhatsApp Italic: _text_
    .replace(/(^|[^\w_])_([^\s_](?:[^_]*[^\s_])?)_([^\w_]|$)/g, '$1<em>$2</em>$3')
    // Replace WhatsApp Strikethrough: ~text~
    .replace(/(^|[^\w~])~([^\s~](?:[^~]*[^\s~])?)~([^\w~]|$)/g, '$1<del>$2</del>$3')
    // Replace WhatsApp Monospace / Code: ```code```
    .replace(/```([\s\S]*?)```/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>');

  return res;
}

/**
 * Checks if a given text string contains HTML tags.
 */
export function isHtmlContent(str = '') {
  if (!str || typeof str !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Formats article content for safe and beautiful display in the news reader modal.
 */
export function formatContentForDisplay(rawContent = '') {
  if (!rawContent || typeof rawContent !== 'string') return '';

  // Remove internal system meta comments (e.g., <!--MEDIA_META:...-->)
  const cleanRaw = rawContent.replace(/<!--[\s\S]*?-->/g, '').trim();

  // If content already contains rich HTML tags
  if (isHtmlContent(cleanRaw)) {
    return sanitizeRichHtml(cleanRaw);
  }

  // If plain text (from WhatsApp or standard typing):
  // Convert WhatsApp formatting first
  const formattedText = formatWhatsAppAndMarkdown(cleanRaw);

  // Split into paragraphs by double newlines or single newlines
  const paragraphs = formattedText.split(/\n\s*\n/);
  
  if (paragraphs.length > 1) {
    return paragraphs
      .map(p => {
        const line = p.trim().replace(/\n/g, '<br />');
        return line ? `<p class="mb-4 leading-relaxed">${line}</p>` : '';
      })
      .join('');
  }

  // Single paragraph with line breaks
  return formattedText.replace(/\n/g, '<br />');
}

/**
 * Parses and processes pasted clipboard data (supports Rich Text from Word/Web/WhatsApp).
 */
export function processPastedContent(clipboardData) {
  if (!clipboardData) return '';

  const htmlData = clipboardData.getData('text/html');
  const textData = clipboardData.getData('text/plain');

  if (htmlData && htmlData.trim()) {
    return sanitizeRichHtml(htmlData);
  }

  if (textData) {
    // If plain text has WhatsApp bold/italics
    return formatWhatsAppAndMarkdown(textData).replace(/\n/g, '<br />');
  }

  return '';
}
