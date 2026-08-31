import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
  const { user } = useAuth();
  const [liAtCookie, setLiAtCookie] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await api.put('/auth/me/cookie', { liAtCookie });
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-slate-400 mb-6">
          Manage your account configuration and integrations.
        </p>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div className="border border-slate-700/50 rounded-xl p-6 bg-slate-800/20">
            <h3 className="text-lg font-medium text-white mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              LinkedIn Real Data Integration
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              To enable 100% Real-Time automated job discovery and Auto-Apply, the AI Agent requires your LinkedIn Session Cookie (`li_at`). This allows the bot to securely authenticate as you via Puppeteer and interact directly with LinkedIn without the restricted official APIs.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  LinkedIn 'li_at' Cookie
                </label>
                <input 
                  type="password"
                  value={liAtCookie}
                  onChange={(e) => setLiAtCookie(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Paste your li_at cookie here"
                />
                <p className="text-xs text-slate-500 mt-2">
                  How to find: Login to LinkedIn {'>'} Inspect Element {'>'} Application Tab {'>'} Cookies {'>'} Copy 'li_at' value.
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || !liAtCookie}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>

          <div className="border border-slate-700/50 rounded-xl p-6 bg-slate-800/20">
            <h3 className="text-lg font-medium text-white mb-2">Danger Zone</h3>
            <p className="text-slate-400 text-sm mb-4">
              Delete all mocked job applications and mock matches to start fresh.
            </p>
            <button className="px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-sm font-medium transition-colors">
              Clear Mock Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
