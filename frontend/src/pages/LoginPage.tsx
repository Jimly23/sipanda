import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@sipanda.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login berhasil! Selamat datang di SIPANDA');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast('Gunakan akun default: admin@sipanda.com / password', {
      icon: 'ℹ️',
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-[#eaf4fd] via-[#f1f7fe] to-[#f6fafe]">
      {/* Soft Blue Atmospheric Background Glow Elements */}
      <div className="absolute -top-28 -left-28 w-[420px] h-[420px] rounded-full bg-blue-200/55 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />

      {/* Floating subtle soft blue accent dots */}
      <div className="absolute top-[20%] left-[16%] w-3 h-3 rounded-full bg-blue-300/40 pointer-events-none" />
      <div className="absolute top-[32%] right-[18%] w-4 h-4 rounded-full bg-sky-300/35 pointer-events-none" />
      <div className="absolute bottom-[24%] left-[22%] w-2.5 h-2.5 rounded-full bg-blue-400/30 pointer-events-none" />
      <div className="absolute bottom-[28%] right-[14%] w-3.5 h-3.5 rounded-full bg-sky-400/25 pointer-events-none" />

      {/* Top Left Brand */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-white flex items-center justify-center p-0.5 overflow-hidden">
          <img src="/logo.png" alt="SIPANDA Logo" className="w-full h-full object-contain scale-125 transform" />
        </div>
        <span className="font-extrabold text-base tracking-tight text-gray-900">
          SIPANDA
        </span>
      </div>

      {/* Concentric subtle circular rings with soft blue strokes */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[480px] h-[480px] rounded-full border border-blue-200/60 absolute" />
        <div className="w-[720px] h-[720px] rounded-full border border-blue-200/45 absolute" />
        <div className="w-[960px] h-[960px] rounded-full border border-blue-200/35 absolute" />
        <div className="w-[1240px] h-[1240px] rounded-full border border-blue-200/20 absolute" />
      </div>

      {/* Floating Center Card */}
      <div className="relative z-10 w-full max-w-[400px] sm:max-w-[420px] rounded-[32px] bg-white/95 backdrop-blur-xl border border-white/90 shadow-2xl shadow-blue-900/10 p-7 sm:p-9 transition-all">
        {/* Top Floating Logo */}
        <div className="w-14 h-14 rounded-2xl bg-white border border-blue-100/80 shadow-xs flex items-center justify-center mx-auto mb-5 p-1 overflow-hidden">
          <img src="/logo.png" alt="SIPANDA Logo" className="w-full h-full object-contain scale-125 transform" />
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Sign in with email
          </h1>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-[270px] mx-auto">
            Sistem Pendukung Keputusan Seleksi Kepanitiaan Berbasis Profile Matching.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email Input */}
          <div className="relative flex items-center bg-[#f1f4f8] hover:bg-[#e9eff6] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 rounded-xl transition-all border border-transparent">
            <Mail size={16} className="text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 font-medium focus:outline-none rounded-xl"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center bg-[#f1f4f8] hover:bg-[#e9eff6] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 rounded-xl transition-all border border-transparent">
            <Lock size={16} className="text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 font-medium focus:outline-none rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button ("Get Started") */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1e1e24] hover:bg-black text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Memproses Masuk...' : 'Get Started'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
