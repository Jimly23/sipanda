import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { LogIn, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@sipanda.com');
  const [password, setPassword] = useState('password');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-2 shadow-xs border border-gray-200/80 mb-3">
            <img src="/logo.png" alt="SIPANDA Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">SIPANDA</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium px-2">
            Sistem Pendukung Keputusan Seleksi Kepanitiaan (Profile Matching)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
            <ShieldCheck className="text-blue-600 shrink-0" size={20} />
            <h2 className="text-sm sm:text-base font-bold text-gray-900">Autentikasi Administrator</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="admin@sipanda.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <LogIn size={18} />
                {loading ? 'Memproses Masuk...' : 'Masuk ke Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-5 sm:mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
            Kredensial Default:{' '}
            <span className="font-mono text-gray-600 font-semibold block sm:inline mt-0.5 sm:mt-0">
              admin@sipanda.com / password
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
