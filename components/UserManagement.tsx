
import React, { useState } from 'react';
import { User, UserRole, Branch } from '../types';
import { Search, Building, Phone, UserPlus, X, Shield, Check, Ban, Clock, Trash2, Users } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  branches: Branch[];
  onAddUser: (user: User) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, branches, onAddUser, onApproveUser, onRejectUser, onDeleteUser 
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<'approved' | 'pending'>('approved');
  const [newManager, setNewManager] = useState({
    name: '',
    phone: '',
    password: '',
    branchId: ''
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.phone.includes(search);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = tab === 'pending' ? u.status === 'PENDING' : u.status === 'APPROVED';
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getBranchName = (branchId?: string) => {
    if (!branchId) return 'الإدارة العامة';
    return branches.find(b => b.id === branchId)?.name || 'فرع غير معروف';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'u' + Date.now(),
      name: newManager.name,
      phone: newManager.phone,
      password: newManager.password,
      role: UserRole.BRANCH_ADMIN,
      branchId: newManager.branchId,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'APPROVED'
    };
    onAddUser(newUser);
    setShowModal(false);
    setNewManager({ name: '', phone: '', password: '', branchId: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">إدارة كافة المستخدمين</h2>
          <p className="text-slate-500 font-medium">عرض وإدارة جميع مدراء الفروع والموظفين في النظام</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <UserPlus size={20} />
            تعيين مدير فرع
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8 mb-4">
        <button 
          onClick={() => setTab('approved')}
          className={`pb-4 px-2 text-sm font-black transition-all relative ${tab === 'approved' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          المستخدمين المعتمدين
          {tab === 'approved' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setTab('pending')}
          className={`pb-4 px-2 text-sm font-black transition-all relative ${tab === 'pending' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          طلبات معلقة
          {users.filter(u => u.status === 'PENDING').length > 0 && (
            <span className="mr-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-black animate-pulse">{users.filter(u => u.status === 'PENDING').length}</span>
          )}
          {tab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو رقم الهاتف..."
              className="w-full pr-12 pl-4 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 self-start sm:self-center">
            <button onClick={() => setRoleFilter('ALL')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${roleFilter === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>الكل</button>
            <button onClick={() => setRoleFilter(UserRole.BRANCH_ADMIN)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${roleFilter === UserRole.BRANCH_ADMIN ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>المدراء</button>
            <button onClick={() => setRoleFilter(UserRole.EMPLOYEE)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${roleFilter === UserRole.EMPLOYEE ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>الموظفين</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-4">المستخدم</th>
                <th className="px-8 py-4">الفرع / المنشأة</th>
                <th className="px-8 py-4">الدور الوظيفي</th>
                <th className="px-8 py-4">بيانات التواصل</th>
                <th className="px-8 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="opacity-20 flex flex-col items-center">
                      <Users size={64} className="mb-4" />
                      <p className="font-black text-slate-900">لا توجد حسابات مطابقة</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                          u.role === UserRole.SUPER_ADMIN ? 'bg-indigo-100 text-indigo-600' :
                          u.role === UserRole.BRANCH_ADMIN ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.joinedDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Building size={14} className="text-slate-300" />
                        <span className="text-sm text-slate-600 font-bold">{getBranchName(u.branchId)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${
                        u.role === UserRole.SUPER_ADMIN ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        u.role === UserRole.BRANCH_ADMIN ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {u.role === UserRole.SUPER_ADMIN ? 'مدير نظام' : u.role === UserRole.BRANCH_ADMIN ? 'مدير فرع' : 'موظف ميداني'}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-700 text-sm font-mono tracking-tight">{u.phone}</td>
                    <td className="px-8 py-5 text-left">
                      <div className="flex items-center gap-2 justify-end">
                        {tab === 'pending' ? (
                          <>
                            <button 
                              onClick={() => onRejectUser(u.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="رفض الطلب"
                            >
                              <Ban size={20} />
                            </button>
                            <button 
                              onClick={() => onApproveUser(u.id)}
                              className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                              title="موافقة وتفعيل"
                            >
                              <Check size={20} />
                            </button>
                          </>
                        ) : (
                          u.role !== UserRole.SUPER_ADMIN && (
                            <button 
                              onClick={() => onDeleteUser(u.id)}
                              className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all active:scale-90"
                              title="حذف الحساب نهائياً"
                            >
                              <Trash2 size={20} />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900">تعيين مدير فرع جديد</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">الاسم الكامل للمدير</label>
                  <input type="text" required value={newManager.name} onChange={e => setNewManager({...newManager, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">رقم الهاتف</label>
                  <input type="text" required value={newManager.phone} onChange={e => setNewManager({...newManager, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">كلمة مرور الحساب</label>
                  <input type="password" required value={newManager.password} onChange={e => setNewManager({...newManager, password: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">الفرع المسؤول عنه</label>
                  <select required value={newManager.branchId} onChange={e => setNewManager({...newManager, branchId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none">
                    <option value="">اختر الفرع المستهدف...</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all mt-4">
                تأكيد التعيين والاعتماد
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;