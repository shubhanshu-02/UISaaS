'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // signIn with credentials provider
    const res = await signIn('credentials', {
      redirect: false, // we handle navigation manually
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      // Show error message from NextAuth.js
      setErrorMsg(res.error);
    } else if (res?.ok) {
      // Redirect to dashboard or home
      router.replace('/dashboard');
    }
  };

  // Demo sign-in (no password)
  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await signIn('credentials', {
      redirect: false,
      // no credentials sent (next-auth will create a demo user)
    });
    setLoading(false);
    if (res?.ok) {
      router.replace('/dashboard');
    } else {
      setErrorMsg('Demo sign-in failed');
    }
  };

  // GitHub OAuth sign-in
  const handleGitHubLogin = async () => {
    setLoading(true);
    await signIn('github', { callbackUrl: '/dashboard' });
  };

  return (
    <main className="max-w-md mx-auto mt-24 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

      {errorMsg && (
        <div className="mb-4 text-red-600 text-center" role="alert">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <hr className="my-6" />

      <div className="space-y-3">
        <button
          onClick={handleGitHubLogin}
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
          </svg>
          {loading ? 'Signing in...' : 'Continue with GitHub'}
        </button>

        <button
          onClick={handleDemoLogin}
          className="w-full border border-gray-500 py-2 rounded hover:bg-gray-100"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Try Demo (No Login)'}
        </button>
      </div>
    </main>
  );
}
