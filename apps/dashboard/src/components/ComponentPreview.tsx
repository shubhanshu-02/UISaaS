'use client';
import { useState, useEffect } from 'react';

interface ComponentPreviewProps {
  code: string;
}

export default function ComponentPreview({ code }: ComponentPreviewProps) {
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  useEffect(() => {
    try {
      // Basic preview - you could enhance this with actual React rendering
      const preview = `
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: white;">
          <div style="font-family: system-ui, -apple-system, sans-serif;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">Component Preview</h4>
            <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px; overflow-x: auto;">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            <div style="margin-top: 10px; padding: 10px; background: #f9fafb; border-radius: 4px;">
              <div style="color: #6b7280; font-size: 14px;">
                This is a basic preview. In a full implementation, you would use Sandpack or similar to render the actual React component.
              </div>
            </div>
          </div>
        </div>
      `;
      setPreviewHtml(preview);
      setError(null);
    } catch (err) {
      setError('Failed to generate preview');
      setPreviewHtml('');
    }
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600 text-sm">Preview Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <iframe
        srcDoc={previewHtml}
        className="w-full h-64 border-none"
        title="Component Preview"
      />
    </div>
  );
}
