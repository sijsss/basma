
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, Clock, AlertTriangle, CheckCircle, TrendingUp, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { User, Branch, UserRole } from '../types';

interface DashboardProps {
  user: User;
  branch: Branch | null;
  setActiveTab: (tab: string) => void; 
}

// تعديل StatsCard ليقبل خاصية onClick وجعلها قابلة للنقر
const StatsCard = ({ title, value, icon: Icon, color, trend, onClick }: any) => (
  <div
    onClick={onClick} // إضافة معالج النقر هنا
    className={`bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between group hover:border-blue-400 hover:shadow-md transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`} // إضافة cursor-pointer
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-inherit/20`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, branch, setActiveTab }) => {
  const daysLeft = branch ? Math.ceil((new Date(branch.subscriptionEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500 pb-20 lg:pb-0">
      
      {/* قسم حالة الاشتراك لمدير الفرع */}
      {user.role === UserRole.BRANCH_ADMIN && branch && (
        <div className={`p-6 sm:p-8 rounded-[2.5rem] border-2 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${daysLeft < 7 ? 'bg-red-50 border-red-100' : 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-100'}`}>
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${daysLeft < 7 ? 'bg-red-100 text-red-600' : 'bg-white/20 text-white'}`}>
              <CreditCard size={32} />
            </div>
            <div className="text-center sm:text-right">
              <h3 className={`text-xl font-black ${daysLeft < 7 ? 'text-red-900' : 'text-white'}`}>حالة اشتراك الفرع</h3>
              <p className={`font-bold text-sm ${daysLeft < 7 ? 'text-red-600' : 'text-blue-100'}`}>ينتهي في: {branch.subscriptionEnd}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase opacity-60">الأيام المتبقية</p>
              <p className="text-2xl font-black leading-none mt-1">{daysLeft > 0 ? daysLeft : 'منتهي'}</p>
            </div>
            {daysLeft < 7 && (
              <button 
                onClick={() => setActiveTab('branches')} 
                className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg"
              >
                تجديد الآن
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard 
          title="إجمالي الموظفين" 
          value="128" 
          icon={Users} 
          color="bg-blue-600" 
          trend="+4%" 
          onClick={() => setActiveTab('employees')} // إضافة onClick
        />
        <StatsCard 
          title="الحضور اليوم" 
          value="112" 
          icon={CheckCircle} 
          color="bg-emerald-600" 
          onClick={() => setActiveTab('attendance')} // إضافة onClick
        />
        <StatsCard 
          title="المتأخرين" 
          value="8" 
          icon={Clock} 
          color="bg-amber-500" 
          onClick={() => setActiveTab('employees')} // إضافة onClick
        />
        <StatsCard 
          title="طلبات الإجازة" 
          value="3" 
          icon={AlertTriangle} 
          color="bg-indigo-600" 
          onClick={() => setActiveTab('employees')} // إضافة onClick
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-8">تحليلات الحضور الأسبوعية</h4>
          <div className="h-[250px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'الأحد', count: 120 },
                { name: 'الاثنين', count: 115 },
                { name: 'الثلاثاء', count: 118 },
                { name: 'الأربعاء', count: 110 },
                { name: 'الخميس', count: 125 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-8">توزيع الحالات</h4>
          <div className="h-[200px] sm:h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'في الوقت', value: 85, color: '#10b981' },
                    { name: 'متأخر', value: 10, color: '#f59e0b' },
                    { name: 'غائب', value: 5, color: '#ef4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {[
                    { name: 'في الوقت', value: 85, color: '#10b981' },
                    { name: 'متأخر', value: 10, color: '#f59e0b' },
                    { name: 'غائب', value: 5, color: '#ef4444' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xl font-black text-slate-900">95%</p>
              <p className="text-[10px] text-slate-400 font-bold">الالتزام</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
