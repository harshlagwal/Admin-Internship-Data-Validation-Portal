import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, User, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (pw) => {
    if (pw.length < 8) return 'Password must be at least 8 characters long.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      return setError('All fields are required.');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    const pwError = validatePassword(form.password);
    if (pwError) return setError(pwError);

    setError('');
    setLoading(true);
    try {
      await signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Something went wrong. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main flex items-center justify-center relative overflow-hidden py-6">
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
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-2xl shadow-primary-900/50 mb-2">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 text-[11px] mt-0.5">Create a new administrator account</p>
        </div>

        {/* Card */}
        <div className="card-glass p-6 md:p-7 shadow-2xl">
          <h2 className="text-base font-semibold text-slate-100 mb-4">Registration</h2>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 mb-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
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
                  type={showPw ? 'text' : 'password'}
                  id="password"
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

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  id="confirm-password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="input pl-10 pr-12"
                />
                <button
                  type="button"
                  id="toggle-confirm-password"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 text-sm mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  Create Admin Account
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-3">
          Authorized personnel only. All activity is logged.
        </p>
      </div>
    </div>
  );
}
