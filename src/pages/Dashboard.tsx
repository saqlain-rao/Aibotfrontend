import { useMetrics, useRecentJobs } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: metricsData, isLoading: isLoadingMetrics } = useMetrics();
  const { data: recentJobsData, isLoading: isLoadingJobs } = useRecentJobs();

  const metrics = [
    { 
      label: 'Jobs Discovered', 
      value: isLoadingMetrics ? '-' : metricsData?.jobsDiscovered || 0, 
      change: '+0%', 
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      label: 'High Matches', 
      value: isLoadingMetrics ? '-' : metricsData?.highMatches || 0, 
      change: '+0%', 
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      label: 'Pending Reviews', 
      value: isLoadingMetrics ? '-' : metricsData?.pendingReviews || 0, 
      change: '+0%', 
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Applications Submitted', 
      value: isLoadingMetrics ? '-' : metricsData?.submitted || 0, 
      change: '+0%', 
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Your AI Career Agent has been working hard while you were away. We've discovered <span className="text-white font-medium">{metricsData?.jobsDiscovered || 0} new jobs</span> and have <span className="text-white font-medium">{metricsData?.pendingReviews || 0} pending applications</span> for you to review.
          </p>
          <div className="mt-6 flex space-x-4">
            <Link to="/review-applications" className="glass-button px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 text-center">
              Review Applications
            </Link>
            <Link to="/profile" className="glass-button px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 text-center">
              Setup Profile
            </Link>
            <Link to="/matches" className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors px-6 py-2.5 rounded-lg font-medium text-center">
              View Matches
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="glass-panel p-6 group hover:border-slate-500/50 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-slate-800/80 text-blue-400 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                {metric.icon}
              </div>
              <span className={`flex items-center space-x-1 text-sm font-medium px-2.5 py-1 rounded-full ${
                metric.trend === 'up' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {metric.trend === 'up' ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
                )}
                <span>{metric.change}</span>
              </span>
            </div>
            <div>
              <p className="text-4xl font-bold text-white tracking-tight">{metric.value}</p>
              <p className="text-slate-400 text-sm mt-1">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity List */}
        <div className="lg:col-span-2 glass-panel p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Top Recommendations</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View all</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoadingJobs ? (
              <div className="text-center py-8 text-slate-400">Loading jobs...</div>
            ) : recentJobsData?.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No jobs discovered yet.</div>
            ) : (
              recentJobsData?.map((job) => (
                <div key={job.id} className="flex items-start p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50 cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xl font-bold text-slate-300 shadow-inner mr-4 shrink-0 group-hover:scale-105 transition-transform">
                    {job.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-lg font-semibold text-white truncate">{job.title}</h4>
                      <div className="ml-4 flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-xs font-bold text-emerald-400">{job.matchScore}% Match</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-400 space-x-3">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {job.company}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block"></span>
                      <span className="text-slate-500 hidden sm:block">
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Status & Background Tasks */}
        <div className="glass-panel p-0 flex flex-col">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-white">Agent Operations</h3>
            <p className="text-sm text-slate-400 mt-1">Real-time background tasks</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </div>
                  <span className="font-medium text-white">Job Discovery</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md">Scraping LinkedIn</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 border border-slate-700">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <span className="font-medium text-white">Resume Evaluation</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md">4 in queue</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 border border-slate-700">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" style={{ animationDuration: '2s' }}></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </div>
                  <span className="font-medium text-white">Auto-Apply</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md">Drafting</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 border border-slate-700">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto p-6 bg-slate-800/30 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total API Calls Today</span>
              <span className="font-semibold text-white">1,402 / 5,000</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
