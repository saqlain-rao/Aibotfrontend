import { useState, useEffect } from 'react';
import api from '../services/api';

interface JobDetails {
  title: string;
  company: string;
  location: string;
  url: string;
}

interface QuestionAnswer {
  questionId: string;
  questionText: string;
  answer: string;
}

interface Draft {
  _id: string;
  jobId: string;
  coverLetter: string;
  questionAnswers: QuestionAnswer[];
  status: string;
  createdAt: string;
  job: JobDetails | null;
}

export const ReviewApplications = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await api.get('/applications/drafts');
        if (response.data.success) {
          setDrafts(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch drafts', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  const handleCopyAndApply = (draft: Draft) => {
    // Copy cover letter to clipboard
    navigator.clipboard.writeText(draft.coverLetter);
    setCopiedId(draft._id);
    setTimeout(() => setCopiedId(null), 3000);

    // Open LinkedIn Job URL in new tab
    if (draft.job?.url) {
      window.open(draft.job.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Review Applications</h2>
        <p className="text-slate-400">Review AI-generated cover letters and answers, then manually submit them to LinkedIn.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : drafts.length === 0 ? (
        <div className="glass-panel p-12 text-center border-dashed border-2 border-slate-700/50">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Drafts Yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto">
            Go to your Matches and click "Auto-Apply" to generate tailored applications.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {drafts.map((draft) => (
            <div key={draft._id} className="glass-panel p-8">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-700/50">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{draft.job?.title || 'Unknown Role'}</h3>
                  <div className="flex items-center text-slate-400 space-x-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      {draft.job?.company || 'Unknown Company'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>{draft.job?.location || 'Remote'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/20">
                    {draft.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cover Letter */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    AI Generated Cover Letter
                  </h4>
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                        {draft.coverLetter}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Question Answers */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Suggested Answers
                  </h4>
                  <div className="space-y-4">
                    {draft.questionAnswers.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">No specific screening questions identified.</p>
                    ) : (
                      draft.questionAnswers.map(qa => (
                        <div key={qa.questionId} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                          <p className="text-xs font-semibold text-slate-400 mb-1">{qa.questionText}</p>
                          <p className="text-sm text-slate-300">{qa.answer}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                <button 
                  onClick={() => handleCopyAndApply(draft)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center group"
                >
                  {copiedId === draft._id ? (
                    <>
                      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Copied! Opening LinkedIn...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      Copy & Apply on LinkedIn
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
