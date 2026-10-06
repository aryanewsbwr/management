import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Underline,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  RemoveFormatting,
  Code,
  Eye,
  Sparkles,
  Check
} from 'lucide-react';
import { sanitizeRichHtml, formatWhatsAppAndMarkdown, isHtmlContent } from '../utils/textFormatter';

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'खबर की पूरी जानकारी यहाँ लिखें (क्या, कब, कहाँ, किसने कहा)...',
  minHeight = '180px'
}) {
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' | 'code'
  const [copiedNotification, setCopiedNotification] = useState(false);
  const editorRef = useRef(null);
  const isInternalUpdate = useRef(false);

  // Sync incoming value to editor innerHTML if not from user's active typing
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      const currentHtml = editorRef.current.innerHTML;
      if (currentHtml !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  // Execute formatting commands on selected text
  const executeCommand = (command, value = null) => {
    if (editorMode !== 'visual') {
      setEditorMode('visual');
    }

    if (editorRef.current) {
      editorRef.current.focus();
    }

    try {
      document.execCommand(command, false, value);
      handleEditorInput();
    } catch (err) {
      console.warn('RichText command error:', err);
    }
  };

  // Sync contentEditable changes to parent onChange
  const handleEditorInput = () => {
    if (editorRef.current && onChange) {
      isInternalUpdate.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  // Keyboard shortcut listener (Ctrl+B, Ctrl+U, Ctrl+I)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        executeCommand('bold');
      } else if (key === 'u') {
        e.preventDefault();
        executeCommand('underline');
      } else if (key === 'i') {
        e.preventDefault();
        executeCommand('italic');
      }
    }
  };

  // Smart Paste Interceptor: supports formatted text from Word, Web, and WhatsApp (*bold*)
  const handlePaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    let contentToInsert = '';

    if (htmlData && htmlData.trim()) {
      // Clean and sanitize rich HTML from Word / Web
      contentToInsert = sanitizeRichHtml(htmlData);
    } else if (textData) {
      // Parse WhatsApp formatting (*bold*, _italic_, ~strike~)
      const formatted = formatWhatsAppAndMarkdown(textData);
      // Split newlines into HTML paragraphs or breaks
      const paragraphs = formatted.split(/\n\s*\n/);
      if (paragraphs.length > 1) {
        contentToInsert = paragraphs
          .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
          .join('');
      } else {
        contentToInsert = formatted.replace(/\n/g, '<br>');
      }
    }

    if (contentToInsert) {
      // Insert cleaned HTML at cursor position
      document.execCommand('insertHTML', false, contentToInsert);
      handleEditorInput();
    }
  };

  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-850 shadow-sm transition focus-within:border-red-500">
      
      {/* 1. TOP FORMATTING TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
        
        {/* Quick Style Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="बोल्ड / गहरा करें (Bold - Ctrl+B)"
          >
            <Bold className="w-4 h-4 font-bold" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="अंडरलाइन करें (Underline - Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="इटैलिक / तिरछा (Italic - Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Subheading (H3) */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', '<h3>'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow text-xs font-bold"
            title="उप-शीर्षक बनाएं (Heading H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          {/* Bullet List */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="बिंदुवार सूची (Bullet List)"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('insertOrderedList'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="क्रमवार सूची (Numbered List)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Align Left */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyLeft'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="बायां संरेखण (Align Left)"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          {/* Align Center */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyCenter'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="मध्य संरेखण (Align Center)"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          {/* Align Right */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyRight'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="दायां संरेखण (Align Right)"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          {/* Align Justify */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyFull'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="समान संरेखण (Justify Full)"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Blockquote */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', '<blockquote>'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="उद्धरण / कोटेशन (Quote Block)"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Clear Formatting */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('removeFormat'); }}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition active:scale-95 shadow-sm hover:shadow"
            title="फॉर्मेटिंग हटाएं (Clear Formatting)"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher: Visual vs Code */}
        <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg text-xs font-bold font-hindi">
          <button
            type="button"
            onClick={() => setEditorMode('visual')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              editorMode === 'visual'
                ? 'bg-white dark:bg-gray-900 text-red-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>विज़ुअल (WYSIWYG)</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorMode('code')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              editorMode === 'code'
                ? 'bg-white dark:bg-gray-900 text-red-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML / कोड</span>
          </button>
        </div>

      </div>

      {/* 2. EDITABLE AREA */}
      {editorMode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          style={{ minHeight }}
          data-placeholder={placeholder}
          className="p-4 bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 font-hindi text-sm sm:text-base leading-relaxed focus:outline-none overflow-y-auto max-h-[500px] prose dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
        />
      ) : (
        <textarea
          rows={8}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-4 bg-gray-900 text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y"
        />
      )}

      {/* 3. BOTTOM HELPER BAR */}
      <div className="px-4 py-2 bg-gray-50/90 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 font-hindi">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            <strong>शॉर्टकट:</strong> बोल्ड करने के लिए <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono text-[10px]">Ctrl+B</kbd> | अंडरलाइन के लिए <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono text-[10px]">Ctrl+U</kbd>
          </span>
        </div>
        <span className="text-gray-400">
          व्हाट्सएप मैटर (*बोल्ड*) कॉपी-पेस्ट करने पर स्वतः फॉर्मेट होगा।
        </span>
      </div>

    </div>
  );
}
