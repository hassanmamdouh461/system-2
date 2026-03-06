import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LS_KEY = 'brewmaster_remembered_username';

export default function Login() {
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── On mount: restore saved username if "Remember Me" was checked before ──
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!username || !password) throw new Error('Please fill in all fields');
      await login(username, password);
      // ── Persist / clear based on checkbox ─────────────────────────────────
      if (rememberMe) {
        localStorage.setItem(LS_KEY, username);
      } else {
        localStorage.removeItem(LS_KEY);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Animations + Custom Checkbox styles ───────────────────────────── */}
      <style>{`
        @keyframes float2d {
          0%,  100% { transform: translateY(0px);  }
          50%        { transform: translateY(-7px); }
        }
        .icon-float {
          animation: float2d 3s ease-in-out infinite;
          will-change: transform;
        }
        .cb-caramel {
          appearance: none;
          -webkit-appearance: none;
          width: 1rem;
          height: 1rem;
          border: 1.5px solid #6b7280;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          transition: border-color 0.2s, background 0.2s;
        }
        .cb-caramel:checked {
          background: #c8956c;
          border-color: #c8956c;
        }
        .cb-caramel:checked::after {
          content: '';
          position: absolute;
          left: 3px;
          top: 0px;
          width: 5px;
          height: 9px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }
        .cb-caramel:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(200,149,108,0.35);
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-caramel/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-mocha-700/10 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10"
        >
          {/* ── Icon + heading ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4 icon-float">
              <div className="absolute inset-0 rounded-full bg-caramel/40 blur-xl scale-150" />
              <div className="relative bg-gradient-to-br from-caramel to-mocha-600 p-3 rounded-full shadow-lg shadow-caramel/40">
                <Coffee className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to manage your cafe</p>
          </div>

          {/* ── Form ───────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-gray-300 text-xs uppercase tracking-wider font-semibold ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-caramel transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition-all placeholder-gray-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-gray-300 text-xs uppercase tracking-wider font-semibold ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-caramel transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition-all placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* ── Remember Me ──────────────────────────────────────────────── */}
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="cb-caramel"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Remember me
              </span>
            </label>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-caramel to-mocha-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-caramel/20 flex items-center justify-center gap-2 hover:shadow-caramel/40 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
