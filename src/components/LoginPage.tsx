import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Activity, CheckCircle2, ArrowRight, Radio, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { name: string; role: string; email?: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Teknisi BimaWaluya');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState('Field Technician');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: username,
        role: role
      });
      setIsLoading(false);
    }, 400);
  };

  const handleQuickLogin = (name: string, userRole: string) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name,
        role: userRole
      });
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 flex flex-col justify-between items-center p-4 sm:p-6 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Placeholder */}
      <div className="w-full max-w-md flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
            SECURE ACCESS PORTAL
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400 font-bold">
          ONLINE v2.6
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto relative z-10 py-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          
          {/* Top Geometric Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500"></div>

          {/* Logo & Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
              <Activity className="w-7 h-7 animate-pulse" />
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
              BimaWaluya <span className="text-cyan-400">Link Budget</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Pengukuran Loss dBm & Perhitungan Rasio Redaman Lapangan
            </p>
          </div>

          {/* Quick Access Roles */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                PILIH PROFIL CEPAT (ROLE)
              </span>
              <span className="text-[9px] font-mono text-cyan-400">Instant Access</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="btn-quick-tech"
                onClick={() => handleQuickLogin('Teknisi BimaWaluya', 'Field Technician')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 p-2.5 rounded-lg text-left transition group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Teknisi</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">OPM Field</div>
              </button>

              <button
                type="button"
                id="btn-quick-admin"
                onClick={() => handleQuickLogin('Administrator', 'Administrator')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 p-2.5 rounded-lg text-left transition group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                  <span>Admin</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">Full Access</div>
              </button>

              <button
                type="button"
                id="btn-quick-noc"
                onClick={() => handleQuickLogin('NOC Engineer', 'NOC Engineer')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 p-2.5 rounded-lg text-left transition group"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
                  <span>NOC</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">Quality Ctr</div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center mb-5">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-mono tracking-wider">
              atau login formulir
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Form Login */}
          <form onSubmit={handleCustomSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">
                Nama Pengguna / Teknisi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nama Lengkap / ID Teknisi"
                  className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded-lg pl-9 pr-3 py-2.5 border border-slate-700 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">
                Role / Peran
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded-lg px-3 py-2.5 border border-slate-700 focus:border-cyan-500 focus:outline-none transition"
              >
                <option value="Field Technician">Teknisi Lapangan / Splicer (Input OPM)</option>
                <option value="NOC Engineer">NOC Engineer (Quality Control & Analisis)</option>
                <option value="FTTH Planner">FTTH Planner (Design & Kalkulasi)</option>
                <option value="Administrator">Administrator (Akses Penuh)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded-lg pl-9 pr-3 py-2.5 border border-slate-700 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-[11px]">Ingat sesi login</span>
              </label>
              <span className="text-[10px] text-cyan-400 font-mono">Offline Ready</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-wider py-3 rounded-lg transition flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/20 active:scale-98 cursor-pointer"
            >
              {isLoading ? (
                <span>Memuat Sistem...</span>
              ) : (
                <>
                  <span>MASUK SEBAGAI {role.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* System Spec Footer */}
          <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Standar: ITU-T G.671 / G.984</span>
            <span className="text-cyan-400 font-bold">@rhd2026</span>
          </div>

        </div>
      </div>

      {/* Footer Copyright */}
      <footer className="w-full max-w-md text-center py-3 text-xs font-mono text-slate-500">
        <p>BimaWaluya Link Budget Simulasi &bull; Copyright <span className="text-cyan-400 font-bold">@rhd2026</span></p>
      </footer>

    </div>
  );
};
