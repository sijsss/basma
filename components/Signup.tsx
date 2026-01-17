
import React, { useState } from 'react';
import { UserPlus, Phone, Lock, User as UserIcon, Building2, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { UserRole, Branch } from '../types';

interface SignupProps {
  branches: Branch[];
  onSignup: (data: any) => void;
  onNavigateToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ branches, onSignup, onNavigateToLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    branchId: '',
    department: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      onSignup({ ...formData, role });
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Tajawal']" dir="rtl">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">تم إرسال الطلب!</h2>
          <p className="text-slate-500 font-bold leading-relaxed">
            لقد تم تسجيل بياناتك بنجاح. طلبك الآن قيد المراجعة من قبل مدير النظام (سجاد). سيتم إخطارك بمجرد الموافقة.
          </p>
          <button 
            onClick={onNavigateToLogin}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all"
          >
            العودة للدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Tajawal']" dir="rtl">
      <div className="max-w-xl w-full bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onNavigateToLogin} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="text-left">
            <h2 className="text-2xl font-black text-slate-900">إنشاء حساب جديد</h2>
            <p className="text-slate-400 text-sm font-bold">انضم إلى منظومة بصمة تك</p>
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <UserPlus size={24} />
          </div>
        </div>

        <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
          <button 
            onClick={() => setRole(UserRole.EMPLOYEE)}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${role === UserRole.EMPLOYEE ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >موظف</button>
          <button 
            onClick={() => setRole(UserRole.BRANCH_ADMIN)}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${role === UserRole.BRANCH_ADMIN ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >مدير فرع</button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" required placeholder="الاسم الكامل" className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="relative group">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" required placeholder="رقم الهاتف" className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="relative group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="password" required placeholder="كلمة المرور" className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            {role === UserRole.EMPLOYEE && (
              <>
                <div className="relative group">
                  <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select required className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none" value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})}>
                    <option value="">اختر الفرع الذي تنتمي إليه...</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <input type="text" placeholder="القسم (اختياري)" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
              </>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={24} />}
            {loading ? 'جاري إرسال الطلب...' : 'إرسال طلب الانضمام'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;