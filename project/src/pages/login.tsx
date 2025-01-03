import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async () => {
    // Basic validation for empty fields
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    // Check credentials with Supabase
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
      .from('auth')
      .select('*')
      .eq('user', username)
      .eq('pass', password)
      .single();

    if (data) {
      await supabase
        .from('auth')
        .update({ checker: true })
        .eq('user', username);

      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      navigate('/'); // Redirect to the dashboard or home page
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#71045F] mb-6">Gym Login</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {errorMessage && (
          <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
        )}
        <button
          onClick={handleLogin}
          className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;