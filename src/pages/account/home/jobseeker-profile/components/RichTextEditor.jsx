import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

export function RichTextEditor({ placeholder, initialValue = '', onChange }) {
  const editorRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = initialValue;
      isInitialized.current = true;
    }
  }, [initialValue]);

  const execCommand = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-1 bg-muted border-b border-input">
        <EditorButton onClick={() => execCommand('bold')} icon={<Bold className="size-4" />} title="Bold" />
        <EditorButton onClick={() => execCommand('italic')} icon={<Italic className="size-4" />} title="Italic" />
        <EditorButton onClick={() => execCommand('underline')} icon={<Underline className="size-4" />} title="Underline" />
        <div className="w-px h-4 bg-border mx-1 self-center" />
        <EditorButton onClick={() => execCommand('formatBlock', 'h1')} icon={<Heading1 className="size-4" />} title="H1" />
        <EditorButton onClick={() => execCommand('formatBlock', 'h2')} icon={<Heading2 className="size-4" />} title="H2" />
        <EditorButton onClick={() => execCommand('formatBlock', 'h3')} icon={<Heading3 className="size-4" />} title="H3" />
        <div className="w-px h-4 bg-border mx-1 self-center" />
        <EditorButton onClick={() => execCommand('insertUnorderedList')} icon={<List className="size-4" />} title="Bullets" />
        <div className="w-px h-4 bg-border mx-1 self-center" />
        <EditorButton onClick={() => execCommand('justifyLeft')} icon={<AlignLeft className="size-4" />} title="Align Left" />
        <EditorButton onClick={() => execCommand('justifyCenter')} icon={<AlignCenter className="size-4" />} title="Align Center" />
        <EditorButton onClick={() => execCommand('justifyRight')} icon={<AlignRight className="size-4" />} title="Align Right" />
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange?.(e.currentTarget.innerHTML)}
        className="min-h-[150px] p-3 focus:outline-none rich-text-content"
        data-placeholder={placeholder}
      />
    </div>
  );
}

function EditorButton({ onClick, icon, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
    >
      {icon}
    </button>
  );
}
