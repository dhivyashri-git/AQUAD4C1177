import React, { useState } from 'react';
import { AppView, UserProfile, UserRole } from '../types';
import { 
  Shield, 
  User, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  AlertCircle 
} from 'lucide-react';
import civicInfraBg from '../assets/images/chennai_civic_infra_1790007100643.jpg';

interface LoginPageProps {
  onNavigate: (view: AppView) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [role, setRole] = useState<UserRole>('citizen');
  const [emailOrUsername, setEmailOrUsername] = useState('citizen@chennaiflow.gov.in');
  const [password, setPassword] = useState('chennai2026');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage('');
    if (newRole === 'citizen') {
      setEmailOrUsername('citizen@chennaiflow.gov.in');
      setPassword('chennai2026');
    } else {
      setEmailOrUsername('admin@chennai.gov.in');
      setPassword('admin@gcc2026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage('Please enter both your identifier and password.');
      return;
    }

    setIsSubmitting(true);

    // Simulate authentic civic authentication
    setTimeout(() => {
      setIsSubmitting(false);

      if (role === 'admin') {
        onLoginSuccess({
          id: 'usr-admin-01',
          name: 'Er. S. Sundaram, M.E.',
          email: emailOrUsername,
          role: 'admin',
          designation: 'Executive Engineer (Stormwater Drains & Canals)',
          ward: 'Greater Chennai Corporation HQ (Ripon Building)',
          division: 'South Region Special Works'
        });
      } else {
        onLoginSuccess({
          id: 'usr-cit-01',
          name: 'K. Rajasekaran',
          email: emailOrUsername,
          role: 'citizen',
          designation: 'Resident & Commuter',
          ward: 'Ward 178 (Velachery East)',
          division: 'Zone 13 Adyar'
        });
      }

      onNavigate('flood-prediction');
    }, 450);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Calm Chennai Civic / Infrastructure Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={civicInfraBg}
          alt="Chennai municipal architecture and infrastructure at dusk"
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        {/* Calm translucent civic overlay */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]"></div>
      </div>

      {/* Top back navigation button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => onNavigate('landing')}
          id="login-btn-back-to-landing"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>
      </div>

      {/* Simple, warm, dignified card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-slate-900 text-white mb-3 shadow-xs">
            <Shield className="w-6 h-6 text-sky-400" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-serif">
            AQUAD4C1177
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Smart Urban Flood &amp; Drainage Intelligence for Chennai
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">
              Welcome back
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign in to access flood intelligence and city response tools.
            </p>
          </div>
        </div>

        {/* User Role Selector (Citizen vs Admin) */}
        <div className="mb-5 p-1 bg-slate-100 rounded-lg flex items-center gap-1 border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => handleRoleSelect('citizen')}
            id="login-tab-citizen"
            className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
              role === 'citizen'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Citizen / Resident</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            id="login-tab-admin"
            className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-slate-700" />
            <span>GCC Municipal Admin</span>
          </button>
        </div>

        {/* Quick Role Hint */}
        <div className="mb-4 px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            {role === 'citizen' ? (
              <span><strong>Citizen Profile:</strong> Safe route navigation, waterlogging reports, 3-hour flood timeline.</span>
            ) : (
              <span><strong>GCC Admin Profile:</strong> Sensor telemetry override, drain blockage work-order dispatch, GIS export.</span>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email / Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder={role === 'citizen' ? 'citizen@chennaiflow.gov.in' : 'admin@chennai.gov.in'}
                className="w-full text-xs px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white text-slate-900"
                required
                id="input-login-username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link dispatched to registered municipal email.')}
                className="text-[11px] text-blue-700 hover:text-blue-900 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white text-slate-900"
                required
                id="input-login-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            id="btn-login-submit"
            className="w-full mt-2 py-2.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <span>Sign In as {role === 'admin' ? 'GCC Administrator' : 'Citizen'}</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <div className="text-[11px] text-slate-500 font-medium">
            Demo Credentials Pre-filled. Click <strong className="text-slate-700">Sign In</strong> to proceed directly.
          </div>
        </div>
      </div>

      {/* Subtle Civic Footnote */}
      <div className="relative z-10 text-center mt-6 text-slate-400 text-xs">
        Greater Chennai Corporation • Integrated Command &amp; Control Centre (ICCC)
      </div>
    </div>
  );
};
