import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Temporarily store token so `api.get('/auth/me')` will use it via interceptor
      localStorage.setItem('token', token);
      
      api.get('/auth/me')
        .then(response => {
          login(token, response.data.data); // Notice data.data because our backend returns { success: true, data: user }
          navigate('/');
        })
        .catch(error => {
          console.error('Failed to fetch user profile after OAuth:', error);
          localStorage.removeItem('token');
          navigate('/login?error=oauth_profile_failed');
        });
    } else {
      navigate('/login?error=missing_token');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-medium">Securing your session with LinkedIn...</p>
    </div>
  );
};
