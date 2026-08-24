import { useState } from 'react';
import { supabase } from './supabaseClient';
import { validateEmail, validatePassword } from './lib/validate';
import { sanitizeError } from './lib/errors';
import toast from 'react-hot-toast';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateAndToast = (validation) => {
    if (!validation.valid) {
      toast.error(validation.error);
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateAndToast(validateEmail(email))) return;
    if (!validateAndToast(validatePassword(password))) return;
    
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) toast.error(sanitizeError(error));
    else toast.success('Signup successful! You can now log in.');
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateAndToast(validateEmail(email))) return;
    if (!validateAndToast(validatePassword(password))) return;
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(sanitizeError(error));
    else toast.success('Logged in successfully!');
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-400">Anime Tracker</h1>
        <p className="text-center text-gray-400">Sign in to save your watchlist</p>
        
        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full py-3 font-semibold text-blue-400 bg-transparent border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
