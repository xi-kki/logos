// ═══════════════════════════════════════════════════════════════
// LOGOS — Auth Button
// Sign in/out with Google, GitHub, or email magic link
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useStore } from '../store';
import { signInWithGoogle, signInWithGitHub, signInWithEmail, signOut } from '../lib/supabase';

export default function AuthButton() {
  const { user, loading } = useStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (loading) {
    return (
      <div className="w-20 h-10 rounded-full bg-black/5 animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-black/10 hover:bg-black/5 transition-all"
        >
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="" 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs font-medium">
              {(user.email?.[0] || '?').toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium hidden sm:block">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </span>
        </button>

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)} 
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-black/10 p-2 z-50">
              <div className="px-3 py-2 border-b border-black/5 mb-2">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-black/50">Signed in</p>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center rounded-full text-sm font-semibold transition-all hover:opacity-90"
        style={{ width: '120px', height: '40px', background: '#000000', color: '#ffffff' }}
      >
        Sign In
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-black/10 p-4 z-50">
            <p className="text-sm font-medium mb-4">Sign in to sync your prompts</p>
            
            {/* Google */}
            <button
              onClick={() => {
                signInWithGoogle();
                setShowDropdown(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-black/10 rounded-lg hover:bg-black/5 transition-colors mb-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              onClick={() => {
                signInWithGitHub();
                setShowDropdown(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-black/90 transition-colors mb-4"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-xs text-black/40">or</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            {/* Email Magic Link */}
            {sent ? (
              <div className="text-center py-2">
                <p className="text-sm text-green-600">✓ Check your email for the magic link</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSending(true);
                  await signInWithEmail(email);
                  setSent(true);
                  setSending(false);
                }}
                className="space-y-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-4 py-2.5 bg-black/5 hover:bg-black/10 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>
            )}

            <p className="text-xs text-black/40 text-center mt-4">
              Free forever. No credit card required.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
