
import React, { useState } from 'react';
import { ShieldCheck, Phone, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  users: User[]; // إضافة خاصية قائمة المستخدمين من الحالة العامة
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onNavigateToSignup }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // البحث في القائمة الديناميكية التي تحتوي على المستخدمين الجدد والقدامى
    setTimeout(() => {
      const user = users.find(u => u.phone === phone && u.password === password);
      
      if (user) {
        // التحقق من حالة الحساب إذا كان مرفوضاً
        if (user.status === 'REJECTED') {
          setError('عذراً، تم رفض طلب انضمامك للمنظومة.');
          setLoading(false);
          return;
        }
        
        onLogin(user);
      } else {
        setError('بيانات الدخول غير صحيحة، يرجى التأكد من الهاتف وكلمة المرور');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Tajawal']" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">نظام بصمة تك</h2>
          <p className="text-slate-400 mt-2 font-bold">بوابة تسجيل الدخول الآمنة</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative group">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                required
                className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-left text-slate-900 placeholder-slate-400"
                placeholder="رقم الهاتف"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="password"
                required
                className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-left text-slate-900 placeholder-slate-400"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 animate-shake">
              <p className="text-red-600 text-sm font-bold text-center leading-tight">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={24} />}
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>

          <button
            type="button"
            onClick={onNavigateToSignup}
            className="w-full py-3 text-blue-600 font-black text-sm hover:underline flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            ليس لديك حساب؟ إنشاء حساب جديد
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;