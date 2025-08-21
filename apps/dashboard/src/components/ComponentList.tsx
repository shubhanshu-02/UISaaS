'use client';
import { useState } from 'react';
import { useComponents } from '../hooks/useComponents';
import MonacoEditor from './MonacoEditor';
import PrivacyToggle from './PrivacyToggle';
import type { Component, CreateComponentPayload } from '@ui-saas/types';
import ComponentPreview from './ComponentPreview';

export function ComponentList({ projectId }: { projectId: string }) {
  const { components, isLoading, mutate } = useComponents(projectId);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [newComponentName, setNewComponentName] = useState('');
  const [addingComponent, setAddingComponent] = useState(false);

  async function handleAddComponent() {
    if (!newComponentName.trim()) return;

    setAddingComponent(true);
    try {
      const payload: CreateComponentPayload = {
        name: newComponentName.trim(),
        code: `import React from 'react';

interface ${newComponentName}Props {
  children?: React.ReactNode;
  className?: string;
}

export function ${newComponentName}({ children, className = '' }: ${newComponentName}Props) {
  return (
    <div className={\`${newComponentName.toLowerCase()}-component \${className}\`}>
      {children}
    </div>
  );
}`,
        projectId,
      };

      const response = await fetch('/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await mutate();
        setNewComponentName('');
        setShowAddComponent(false);
      }
    } catch (error) {
      console.error('Failed to add component:', error);
    }
    setAddingComponent(false);
  }

  async function handleUpdateComponent(component: Component, newCode: string) {
    try {
      const response = await fetch(`/api/components/${component.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newCode }),
      });

      if (response.ok) {
        await mutate();
      }
    } catch (error) {
      console.error('Failed to update component:', error);
    }
  }

  async function handleDeleteComponent(component: Component) {
    if (!confirm(`Are you sure you want to delete "${component.name}"?`)) return;

    try {
      const response = await fetch(`/api/components/${component.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await mutate();
        if (selectedComponent?.id === component.id) {
          setSelectedComponent(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete component:', error);
    }
  }

  function copyCliCommand(component: Component) {
    const command = `npx my-ui-lib add ${component.name} --project ${projectId}`;
    navigator.clipboard.writeText(command);
    alert('CLI command copied to clipboard!');
  }

  if (isLoading) return <div className="animate-pulse">Loading components...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900">Components</h4>
        <button
          onClick={() => setShowAddComponent(true)}
          className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          + Add Component
        </button>
      </div>

      {showAddComponent && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComponentName}
              onChange={(e) => setNewComponentName(e.target.value)}
              placeholder="Component name (e.g., Button)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleAddComponent}
              disabled={addingComponent || !newComponentName.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
            >
              {addingComponent ? 'Adding...' : 'Add'}
            </button>
            <button
              onClick={() => setShowAddComponent(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!components || components.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No components found. Create your first component!
        </div>
      ) : (
        <div className="grid gap-4">
          {components.map((component: Component) => (
            <div key={component.id} className="border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h5 className="font-medium text-gray-900">{component.name}</h5>
                    <PrivacyToggle component={component} onUpdate={mutate} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyCliCommand(component)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                    >
                      📋 Copy CLI
                    </button>
                    <button
                      onClick={() => setSelectedComponent(selectedComponent?.id === component.id ? null : component)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      {selectedComponent?.id === component.id ? 'Hide' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(component)}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {selectedComponent?.id === component.id && (
                <div className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Code Editor</h6>
                      <MonacoEditor
                        code={component.code}
                        language="typescript"
                        onChange={(newCode : string) => handleUpdateComponent(component, newCode)}
                      />
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Live Preview</h6>
                      <ComponentPreview code={component.code} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
