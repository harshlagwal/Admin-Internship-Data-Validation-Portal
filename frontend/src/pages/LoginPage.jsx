import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Both fields are required.');
    setError('');
    setLoading(true);
    try {
      const { data } = await login(form);
      signIn(data.admin, data.token);
      toast.success(`Welcome back, ${data.admin.fullName}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Invalid credentials. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main flex items-center justify-center relative overflow-hidden py-4">
      {/* Theme Toggle Position */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #6366f1 0, #6366f1 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, #6366f1 0, #6366f1 1px, transparent 1px, transparent 80px)' }} />

      <div className="relative w-full max-w-md px-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-2xl shadow-primary-900/50 mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 text-xs mt-0.5">Internship & Data Validation System</p>
        </div>

        {/* Card */}
        <div className="card-glass p-6 md:p-7 shadow-2xl">
          <h2 className="text-base font-semibold text-slate-100 mb-4">Sign in to your account</h2>

          {error && (
            <div className="flex items-center gap-2 text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@portal.gov"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input pl-10 pr-12"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-login"
              className="btn-primary w-full justify-center py-2.5 text-sm mt-1"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign In Securely
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              New administrator?{' '}
              <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-4">
          Authorized personnel only. All activity is monitored and logged.
        </p>
      </div>
    </div>
  );
}
