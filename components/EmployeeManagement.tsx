
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_RECORDS } from '../constants';
import { Search, Filter, FileDown, UserPlus, MoreHorizontal, X, Check, Ban, Clock, UserCheck, Users, Trash2 } from 'lucide-react';

interface EmployeeManagementProps {
  user: User;
  users: User[];
  onAddEmployee: (user: User) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onDeleteEmployee: (userId: string) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ 
  user, users, onAddEmployee, onApproveUser, onRejectUser, onDeleteEmployee 
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'pending'>('all');
  const [newEmp, setNewEmp] = useState({
    name: '',
    phone: '',
    password: '',
    department: ''
  });

  const filteredEmployees = users.filter(emp => {
    const isEmployee = emp.role === UserRole.EMPLOYEE;
    const belongsToBranch = user.role === UserRole.SUPER_ADMIN || emp.branchId === user.branchId;
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                         (emp.employeeId?.toLowerCase().includes(search.toLowerCase()) ?? false) || 
                         emp.phone.includes(search);
    const matchesStatus = activeSubTab === 'pending' ? emp.status === 'PENDING' : emp.status === 'APPROVED';
    
    return isEmployee && belongsToBranch && matchesSearch && matchesStatus;
  });

  const pendingCount = users.filter(u => 
    u.role === UserRole.EMPLOYEE && 
    (user.role === UserRole.SUPER_ADMIN || u.branchId === user.branchId) && 
    u.status === 'PENDING'
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'u' + Date.now(),
      name: newEmp.name,
      phone: newEmp.phone,
      password: newEmp.password,
      role: UserRole.EMPLOYEE,
      branchId: user.branchId,
      department: newEmp.department,
      employeeId: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'APPROVED'
    };
    onAddEmployee(newUser);
    setShowModal(false);
    setNewEmp({ name: '', phone: '', password: '', department: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">إدارة القوى العاملة</h2>
          <p className="text-slate-400 text-sm font-medium">إدارة الموظفين وطلبات الانضمام للفرع</p>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all">
            <FileDown size={18} />
            تصدير
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
          >
            <UserPlus size={20} />
            إضافة موظف
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8 mb-2">
        <button 
          onClick={() => setActiveSubTab('all')}
          className={`pb-4 px-2 text-sm font-black transition-all relative ${activeSubTab === 'all' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          كافة الموظفين
          {activeSubTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveSubTab('pending')}
          className={`pb-4 px-2 text-sm font-black transition-all relative ${activeSubTab === 'pending' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          طلبات معلقة
          {pendingCount > 0 && (
            <span className="mr-2 px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-black animate-pulse">{pendingCount}</span>
          )}
          {activeSubTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ابحث بالاسم، الهاتف أو الرقم الوظيفي..."
              className="w-full pr-12 pl-4 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-4">الموظف</th>
                <th className="px-8 py-4">القسم</th>
                <th className="px-8 py-4 text-center">{activeSubTab === 'pending' ? 'تاريخ الطلب' : 'الحالة اليوم'}</th>
                <th className="px-8 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <Users size={64} className="mb-4" />
                      <p className="font-black text-slate-400">لا يوجد موظفين لعرضهم</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const lastRecord = INITIAL_RECORDS.find(r => r.userId === emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black">
                            {emp.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{emp.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-600 font-bold">{emp.department || 'عام'}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {activeSubTab === 'pending' ? (
                          <span className="text-sm text-slate-500 font-bold">{emp.joinedDate}</span>
                        ) : (
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                            lastRecord?.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            'bg-slate-50 text-slate-400 border border-slate-100'
                          }`}>
                            {lastRecord?.status === 'PRESENT' ? 'حاضر الآن' : 'غير متواجد'}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="flex items-center gap-2 justify-end">
                          {activeSubTab === 'pending' ? (
                            <>
                              <button 
                                onClick={() => onRejectUser(emp.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                title="رفض الطلب"
                              >
                                <Ban size={20} />
                              </button>
                              <button 
                                onClick={() => onApproveUser(emp.id)}
                                className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                                title="موافقة"
                              >
                                <Check size={20} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => onDeleteEmployee(emp.id)}
                                className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all active:scale-95"
                                title="حذف الموظف نهائياً"
                              >
                                <Trash2 size={18} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-blue-600 transition-all">
                                <MoreHorizontal size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900">إضافة موظف للمقر</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">اسم الموظف الثلاثي</label>
                  <input type="text" required value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">رقم الهاتف النشط</label>
                  <input type="text" required value={newEmp.phone} onChange={e => setNewEmp({...newEmp, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">كلمة مرور أولية</label>
                  <input type="password" required value={newEmp.password} onChange={e => setNewEmp({...newEmp, password: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">القسم / الإدارة</label>
                  <input type="text" required value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900" placeholder="مثال: المبيعات، الحسابات" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all mt-4">
                اعتماد الموظف الآن
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
