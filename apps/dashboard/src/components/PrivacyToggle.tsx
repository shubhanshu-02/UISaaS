'use client';
import { useState } from 'react';
import type { Component } from '@ui-saas/types';

interface PrivacyToggleProps {
  component: Component;
  onUpdate: () => void;
}

export default function PrivacyToggle({ component, onUpdate }: PrivacyToggleProps) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const response = await fetch(`/api/components/${component.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !component.isPublic }),
      });

      if (response.ok) {
        await onUpdate(); // Refresh the component list
      } else {
        const data = await response.json();
        alert(`Failed to update privacy: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Failed to update privacy settings');
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs px-2 py-1 rounded-full ${
        component.isPublic
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      {loading ? '...' : component.isPublic ? '🌍 Public' : '🔒 Private'}
    </button>
  );
}
