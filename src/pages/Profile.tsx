import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SOFTWARE_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Software Engineer',
  'AI/ML Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile App Developer (iOS/Android)',
  'Cloud Architect',
  'QA Automation Engineer',
  'Product Manager',
];

export const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [resumeMessage, setResumeMessage] = useState('');

  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(['Full-time']);
  const [remoteOnly, setRemoteOnly] = useState(true);
  
  // Profile State
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prefsRes, profileRes] = await Promise.all([
          api.get('/preferences'),
          api.get('/profile')
        ]);
        
        if (prefsRes.data.success && prefsRes.data.data) {
          const prefs = prefsRes.data.data;
          setTargetRoles(prefs.targetRoles || []);
          setEmploymentTypes(prefs.employmentTypes || ['Full-time']);
          setRemoteOnly(prefs.remoteOnly ?? true);
        }

        if (profileRes.data.success && profileRes.data.data) {
          setProfile(profileRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleToggle = (role: string) => {
    setTargetRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await api.put('/preferences', {
        targetRoles,
        employmentTypes,
        remoteOnly
      });
      setMessage('Preferences saved successfully! The AI Agent will now search jobs based on these settings.');
    } catch (error) {
      console.error('Failed to save preferences', error);
      setMessage('Failed to save preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setResumeMessage('Only PDF files are supported.');
      return;
    }

    setIsUploading(true);
    setResumeMessage('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setResumeMessage('Resume parsed successfully! Your profile has been updated.');
        // Refresh profile data
        const profileRes = await api.get('/profile');
        if (profileRes.data.success && profileRes.data.data) {
          setProfile(profileRes.data.data);
        }
      }
    } catch (error) {
      console.error('Failed to upload resume', error);
      setResumeMessage('Failed to upload and parse resume.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Resume Upload Section */}
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Resume</h2>
        <p className="text-slate-400 mb-6">
          Upload your PDF resume. The AI Agent will extract your skills and experience to auto-fill your profile.
        </p>

        {resumeMessage && (
          <div className={`p-4 mb-6 rounded-lg ${resumeMessage.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {resumeMessage}
          </div>
        )}

        <div className="flex items-center justify-center w-full mb-6">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-800/50 hover:bg-slate-800/80 hover:border-blue-500/50 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <svg className="animate-spin mb-3 w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <p className="mb-2 text-sm text-slate-300 font-semibold">Parsing Resume with AI...</p>
                </>
              ) : (
                <>
                  <svg className="w-10 h-10 mb-3 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <p className="mb-2 text-sm text-slate-300"><span className="font-semibold">{profile ? 'Upload New Resume' : 'Click to upload'}</span> or drag and drop</p>
                  <p className="text-xs text-slate-500">PDF ONLY (MAX. 5MB)</p>
                </>
              )}
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>

        {profile && (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              Extracted Profile Data
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="text-slate-300 font-medium">{profile.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Headline</p>
                <p className="text-slate-300 font-medium">{profile.headline}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Extracted Skills</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills?.map((skill: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Job Search Preferences</h2>
        <p className="text-slate-400 mb-8">
          Select your target software development fields. The AI Agent will continuously search LinkedIn and apply to jobs that match these criteria.
        </p>



        <div className="space-y-8">
          
          {/* Target Roles */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Software Development Fields
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SOFTWARE_ROLES.map(role => {
                const isSelected = targetRoles.includes(role);
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleToggle(role)}
                    className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? 'bg-blue-500/10 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-sm font-medium">{role}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Location Preferences */}
          <div className="pt-6 border-t border-slate-700/50">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Work Setting
            </h3>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${remoteOnly ? 'bg-blue-500' : 'bg-slate-700 group-hover:bg-slate-600'}`}>
                {remoteOnly && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={remoteOnly} 
                onChange={() => setRemoteOnly(!remoteOnly)} 
              />
              <div>
                <p className="text-white font-medium">Remote Work Only</p>
                <p className="text-sm text-slate-400">Only search and apply for 100% remote positions.</p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-700/50 flex flex-col items-end space-y-4">
            {message && (
              <div className={`p-4 rounded-lg w-full text-center ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {message}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving...
                </>
              ) : 'Save Preferences'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
