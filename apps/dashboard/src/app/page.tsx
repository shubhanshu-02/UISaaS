'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { ProjectList } from '../components/ProjectList';
import { TierBanner } from '../components/TierBanner';
import { CreateProjectModal } from '../components/CreateProjectModal';

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);

  async function handleDemoSignIn() {
    setLoading(true);
    try {
      await signIn('credentials', { redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Demo sign in failed:', error);
    }
    setLoading(false);
  }

  async function handleSignOut() {
    await signOut({ redirect: true, callbackUrl: '/' });
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome to UI SaaS Dashboard
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Build custom UI components with AI and theme extraction
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-4">
              <button
                onClick={() => signIn('github')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign in with GitHub
              </button>
              
              <button
                onClick={handleDemoSignIn}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  '🚀 Try Demo (No Login Required)'
                )}
              </button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Features</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  Extract themes from any website
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  AI-powered component generation
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  Live component preview & editing
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  CLI integration for easy setup
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                UI SaaS Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <TierBanner tier={session.user?.tier || 'FREE'} />
        
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            <button
              onClick={() => setShowCreateProject(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + New Project
            </button>
          </div>
          
          <ProjectList />
        </div>
      </main>

      {showCreateProject && (
        <CreateProjectModal onClose={() => setShowCreateProject(false)} />
      )}
    </div>
  );
}
