import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  X,
  AlertCircle,
  CheckCircle2,
  Key
} from 'lucide-react';
import { loginAdmin, setCustomAdminPin, getStoredAdminPin } from '../utils/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = loginAdmin(pin);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setPin('');
        onLoginSuccess();
        onClose();
      }, 700);
    } else {
      setError('Incorrect Admin Passcode. Please enter authorized Management PIN (Default: 2025).');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setError('New PIN must be at least 4 characters/digits.');
      return;
    }
    const saved = setCustomAdminPin(newPin.trim());
    if (saved) {
      setPinChangeSuccess(true);
      setTimeout(() => {
        setPinChangeSuccess(false);
        setIsChangingPin(false);
        setNewPin('');
      }, 1200);
    }
  };

  return (
    <div
      id="admin-login-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="w-3 h-3" /> Management Access Only
            </div>
            <h3 className="text-xl font-black text-white">Sri Infra Admin Login</h3>
          </div>
        </div>

        {showSuccess ? (
          <div className="py-8 text-center space-y-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Admin Authorized!</h4>
            <p className="text-xs text-emerald-300">
              Venture photo management & upload permissions unlocked.
            </p>
          </div>
        ) : isChangingPin ? (
          <form onSubmit={handleChangePin} className="space-y-4">
            <p className="text-xs text-slate-300">
              Set a new custom PIN for Sri Infra photo and portal management:
            </p>

            {pinChangeSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> PIN successfully updated!
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                New Admin PIN
              </label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter at least 4 digits..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-base text-center tracking-widest font-mono outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsChangingPin(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
              >
                Save PIN
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-400">
              Please enter the Sri Infra administrator PIN to upload venture photos, update site progress, or manage the gallery:
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Passcode / PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN (e.g. 2025)"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3.5 text-white text-center text-lg tracking-widest font-mono outline-none transition"
                />
                <KeyRound className="w-5 h-5 text-slate-500 absolute right-4 top-4" />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Default PIN: <strong className="text-amber-400 font-mono">2025</strong></span>
                <span>or <strong className="text-amber-400 font-mono">sriinfra2025</strong></span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" /> Unlock Admin Photo Upload
              </button>

              <button
                type="button"
                onClick={() => setIsChangingPin(true)}
                className="text-center text-[11px] text-slate-400 hover:text-amber-400 pt-2 transition flex items-center justify-center gap-1"
              >
                <Key className="w-3 h-3" /> Change Admin Passcode / PIN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
