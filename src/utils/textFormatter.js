import DOMPurify from 'dompurify';

/**
 * Text & Rich Content Formatter for Arya News Agency
 * Supports Rich HTML, WhatsApp Formatting (*bold*, _italic_, ~strike~),
 * Alignment, Underline, and Safe Content Sanitization via DOMPurify.
 */

// Configure DOMPurify hook to enforce rel="noopener noreferrer" on target="_blank" links
// and allow only http, https, mailto, and tel URLs on anchor tags.
if (typeof DOMPurify.addHook === 'function') {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      if (href) {
        const trimmed = href.trim();
        // Allow only http, https, mailto, tel URLs
        if (!/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
          node.removeAttribute('href');
        }
      }
      if (node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });
}

/**
 * Sanitizes HTML string using DOMPurify.
 * Allows only the formatting tags and attributes used by the rich editor.
 */
export function sanitizeRichHtml(html = '') {
  if (!html || typeof html !== 'string') return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'span', 'div', 'hr',
      'a', 'mark', 'sub', 'sup', 'code', 'pre'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'style', 'class', 'align', 'dir', 'title'
    ],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:)/i,
    ALLOW_DATA_ATTR: false
  });
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

/**
 * Strips all HTML tags, inline styles, comments, and entities, converting rich HTML to clean plain text.
 * Essential for social sharing (WhatsApp, Facebook, Twitter), SMS, and meta descriptions.
 */
export function stripHtmlToPlainText(input = '') {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments / metadata
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style blocks
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script blocks
    .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newline
    .replace(/<\/p>/gi, '\n\n') // Convert </p> to double newline
    .replace(/<\/div>/gi, '\n') // Convert </div> to newline
    .replace(/<\/li>/gi, '\n') // Convert </li> to newline
    .replace(/<li[^>]*>/gi, '• ') // Convert <li> to bullet
    .replace(/<[^>]*>/g, '') // Strip all remaining HTML tags
    .replace(/&nbsp;/gi, ' ') // Replace non-breaking spaces
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[ \t]+/g, ' ') // Collapse multiple spaces
    .replace(/\n\s*\n\s*\n+/g, '\n\n') // Collapse excessive newlines
    .trim();
}
