import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';

interface JobDetails {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
}

interface Match {
  _id: string;
  jobId: string;
  matchScore: number;
  explanation: string;
  job: JobDetails;
}

export const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draftingId, setDraftingId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      if (response.data.success) {
        setMatches(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch matches', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleInstantScan = async () => {
    setIsScanning(true);
    try {
      await api.post('/discovery/trigger');
      // After discovery completes, fetch matches again
      await fetchMatches();
    } catch (error) {
      console.error('Failed to run discovery scan', error);
      alert('Failed to trigger scan. Ensure you have saved your LinkedIn cookie in settings.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAutoApply = async (matchId: string) => {
    setDraftingId(matchId);
    try {
      const response = await api.post('/applications/draft', { matchId });
      if (response.data.success) {
        navigate('/review-applications');
      }
    } catch (error) {
      console.error('Failed to draft application', error);
      alert('Failed to start application drafter.');
    } finally {
      setDraftingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Job Matches</h2>
          <p className="text-slate-400">Review jobs discovered by your AI Agent.</p>
        </div>
        <button 
          onClick={handleInstantScan}
          disabled={isScanning}
          className="glass-button px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 flex items-center hover:bg-slate-700/50 disabled:opacity-50 transition-colors"
        >
          {isScanning ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Scanning LinkedIn...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Run Instant Scan
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700/50 pb-2">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-2">Match Score</label>
                <input type="range" min="0" max="100" defaultValue="80" className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0%</span>
                  <span>80%+</span>
                  <span>100%</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-2">Work Setting</label>
                <div className="space-y-2">
                  <label className="flex items-center text-slate-300 text-sm cursor-pointer hover:text-white">
                    <input type="checkbox" defaultChecked className="mr-3 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                    Remote
                  </label>
                  <label className="flex items-center text-slate-300 text-sm cursor-pointer hover:text-white">
                    <input type="checkbox" className="mr-3 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                    Hybrid
                  </label>
                  <label className="flex items-center text-slate-300 text-sm cursor-pointer hover:text-white">
                    <input type="checkbox" className="mr-3 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                    On-site
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : matches.length === 0 ? (
            <div className="glass-panel p-12 text-center border-dashed border-2 border-slate-700/50">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Matches Yet</h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                Your AI Agent is currently scanning LinkedIn for jobs that match your profile and preferences. This usually takes a few minutes.
              </p>
            </div>
          ) : (
            matches.map((match) => {
              if (!match.job) return null; // Skip if job details failed to attach
              return (
              <div key={match._id} className="glass-panel p-6 hover:border-slate-500/50 transition-colors duration-300 group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-2xl font-bold text-slate-300 shadow-inner mr-5 group-hover:scale-105 transition-transform">
                      {match.job.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{match.job.title}</h4>
                      <div className="flex items-center text-slate-400 space-x-3 text-sm">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          {match.job.company}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {match.job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span className="text-sm font-bold text-emerald-400">{match.matchScore}% Match</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm line-clamp-2 mb-2 leading-relaxed">
                  {match.explanation}
                </p>

                <div className="flex items-center justify-end border-t border-slate-700/50 pt-4">
                  <div className="flex space-x-3">
                    <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Discard</button>
                    <button 
                      onClick={() => handleAutoApply(match._id)}
                      disabled={draftingId === match._id}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center"
                    >
                      {draftingId === match._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Drafting...
                        </>
                      ) : 'Auto-Apply'}
                    </button>
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
};
