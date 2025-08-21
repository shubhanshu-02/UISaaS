'use client';
import type { User } from '@ui-saas/types';

export function TierBanner({ tier }: { tier: User['tier'] }) {
  if (tier === 'DEMO') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Demo Mode:</strong> You have limited features.{' '}
              <a href="/api/auth/signin" className="font-medium underline">
                Sign up for full access
              </a>
              {' '}or{' '}
              <a href="/pricing" className="font-medium underline">
                view pricing
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (tier === 'FREE') {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Free Plan:</strong> Limited to 5 components and 1 project.{' '}
              <a href="/upgrade" className="font-medium underline">
                Upgrade to Pro
              </a>
              {' '}for unlimited access and AI features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
