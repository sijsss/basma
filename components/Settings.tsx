
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Phone, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState(user.password || '');
  const [confirmPassword, setConfirmPassword] = useState(user.password || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (phone.length < 10) {
      setError('رقم الهاتف غير صحيح');
      return;
    }

    onUpdateUser({ ...user, phone, password });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Shield size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">إعدادات الحساب</h2>
            <p className="text-slate-500 font-medium">قم بتحديث بيانات الدخول الخاصة بك</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">كلمة المرور الجديدة</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="password"
                    className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">تأكيد كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="password"
                    className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {saved && (
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-3 text-sm font-bold border border-emerald-100">
              <CheckCircle2 size={18} />
              تم حفظ التغييرات بنجاح
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Save size={20} />
            حفظ التغييرات
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;