'use client';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface MonacoEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

export default function MonacoEditor({ 
  code, 
  language, 
  onChange, 
  height = '400px',
  readOnly = false 
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let isMounted = true;

    async function initializeMonaco() {
      try {
        // Dynamically import Monaco Editor
        const monaco = await import('monaco-editor');
        monacoRef.current = monaco;

        if (!isMounted || !containerRef.current) return;

        // Configure TypeScript compiler options
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: true,
          esModuleInterop: true,
          jsx: monaco.languages.typescript.JsxEmit.React,
          reactNamespace: 'React',
          allowJs: true,
          typeRoots: ['node_modules/@types'],
        });

        // Add React types
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare module "react" {
            export interface FC<P = {}> {
              (props: P, context?: any): ReactElement | null;
            }
            export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
              type: T;
              props: P;
              key: Key | null;
            }
            export interface ReactNode {}
            export type Key = string | number;
            export type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
            export class Component<P, S> {}
          }`,
          'file:///node_modules/@types/react/index.d.ts'
        );

        // Create the editor instance
        editorRef.current = monaco.editor.create(containerRef.current, {
          value: code,
          language: language,
          theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          readOnly: readOnly,
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          fixedOverflowWidgets: true,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
        });

        // Handle content changes
        const disposable = editorRef.current.onDidChangeModelContent(() => {
          const newValue = editorRef.current.getValue();
          if (newValue !== code && onChange) {
            onChange(newValue);
          }
        });

        // Handle theme changes
        const handleThemeChange = () => {
          if (editorRef.current && monacoRef.current) {
            monacoRef.current.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs-light');
          }
        };

        // Store disposable for cleanup
        editorRef.current._disposable = disposable;
        editorRef.current._themeHandler = handleThemeChange;

        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize Monaco Editor:', err);
        setError('Failed to load code editor');
        setIsLoading(false);
      }
    }

    initializeMonaco();

    return () => {
      isMounted = false;
      if (editorRef.current) {
        if (editorRef.current._disposable) {
          editorRef.current._disposable.dispose();
        }
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  // Update editor value when code prop changes
  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      const position = editorRef.current.getPosition();
      editorRef.current.setValue(code);
      if (position) {
        editorRef.current.setPosition(position);
      }
    }
  }, [code]);

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs-light');
    }
  }, [theme]);

  // Handle language changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center border border-red-300 bg-red-50 text-red-700 rounded-md"
        style={{ height }}
      >
        <div className="text-center">
          <p className="font-medium">Editor Error</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center border border-gray-300 bg-gray-50 rounded-md"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div ref={containerRef} style={{ height }} />
    </div>
  );
}
