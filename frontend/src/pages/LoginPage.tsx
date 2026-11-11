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

  const handleDemoFill = (provider: string) => {
    setEmail('admin@sipanda.com');
    setPassword('password');
    toast.success(`Kredensial demo (${provider}) dimuat! Silakan klik 'Get Started'`);
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
        <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-white flex items-center justify-center p-1.5">
          <img src="/logo.png" alt="SIPANDA Logo" className="w-full h-full object-contain" />
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
        <div className="w-14 h-14 rounded-2xl bg-white border border-blue-100/80 shadow-xs flex items-center justify-center mx-auto mb-5 p-2.5">
          <img src="/logo.png" alt="SIPANDA Logo" className="w-full h-full object-contain" />
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

        {/* Divider: Or sign in with */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-gray-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-medium text-gray-400">
            Or sign in with
          </span>
        </div>

        {/* Social / Quick Action Icons */}
        <div className="grid grid-cols-3 gap-3">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleDemoFill('Google')}
            className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-gray-200/90 bg-white hover:bg-gray-50 shadow-2xs hover:shadow-xs transition cursor-pointer"
            title="Masuk via Google"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.43l4.02-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() => handleDemoFill('Facebook')}
            className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-gray-200/90 bg-white hover:bg-gray-50 shadow-2xs hover:shadow-xs transition cursor-pointer"
            title="Masuk via Facebook"
          >
            <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleDemoFill('Apple')}
            className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-gray-200/90 bg-white hover:bg-gray-50 shadow-2xs hover:shadow-xs transition cursor-pointer"
            title="Masuk via Apple"
          >
            <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.05-1.82.93-2.87-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.75-.95 2.78 1.02.08 2.06-.52 2.69-1.28z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
