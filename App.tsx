
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AttendancePortal from './components/AttendancePortal';
import EmployeeManagement from './components/EmployeeManagement';
import SmartReports from './components/SmartReports';
import BranchManagement from './components/BranchManagement';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import BranchSetup from './components/BranchSetup';
import { UserRole, User, Branch } from './types';
import { BRANCHES as INITIAL_BRANCHES, USERS as INITIAL_USERS } from './constants';
import { Bell, User as UserIcon, Menu, Fingerprint, LayoutDashboard, Users, AlertCircle, RefreshCw, Building2, Settings as SettingsIcon, MessageSquare, PhoneCall } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'signup' | 'app'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [branch, setBranch] = useState<Branch | null>(null);

  useEffect(() => {
    if (user && user.branchId) {
      const foundBranch = branches.find(b => b.id === user.branchId);
      setBranch(foundBranch || null);
    } else {
      setBranch(null);
    }
  }, [user, branches]);

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddBranch = (newBranch: Branch) => {
    setBranches(prev => [...prev, newBranch]);
    if (user && user.role === UserRole.BRANCH_ADMIN) {
      const updatedUser = { ...user, branchId: newBranch.id };
      handleUpdateUser(updatedUser);
    }
  };

  const handleUpdateBranch = (updatedBranch: Branch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
  };

  const handleDeleteBranch = (id: string) => {
    if (window.confirm('⚠️ تحذير: هل أنت متأكد من حذف هذا الفرع نهائياً؟ سيتم مسح كافة البيانات التابعة له.')) {
      setBranches(prev => prev.filter(b => b.id !== id));
      // عند حذف فرع، يفضل تحويل المستخدمين التابعين له ليكونوا بدون فرع أو حذفهم
      setUsers(prev => prev.map(u => u.branchId === id ? { ...u, branchId: undefined } : u));
    }
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.role === UserRole.SUPER_ADMIN) {
      alert('لا يمكن حذف مدير النظام الرئيسي.');
      return;
    }
    if (window.confirm('⚠️ هل أنت متأكد من حذف هذا الحساب (موظف/مدير) بشكل نهائي؟')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSignup = (data: any) => {
    const newUser: User = {
      id: 'u' + Date.now(),
      name: data.name,
      phone: data.phone,
      password: data.password,
      role: data.role,
      branchId: data.branchId,
      department: data.department,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'APPROVED' } : u));
  };

  const handleRejectUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'REJECTED' } : u));
  };

  const handleActivateSubscription = (branchId: string) => {
    setBranches(prev => prev.map(b => b.id === branchId ? { ...b, isPaid: true, isActive: true } : b));
  };

  const handleExtendSubscription = (branchId: string, months: number) => {
    setBranches(prev => prev.map(b => {
      if (b.id === branchId) {
        const date = new Date(b.subscriptionEnd);
        date.setMonth(date.getMonth() + months);
        return { ...b, subscriptionEnd: date.toISOString().split('T')[0], isPaid: true, isActive: true };
      }
      return b;
    }));
  };

  const isSubscriptionExpired = () => {
    if (user?.role === UserRole.SUPER_ADMIN) return false;
    if (!branch) return false;
    return !branch.isActive || !branch.isPaid || new Date(branch.subscriptionEnd) < new Date();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user!} branch={branch} setActiveTab={setActiveTab} />; // تمرير setActiveTab هنا
      case 'attendance': return <AttendancePortal branch={branch} />;
      case 'employees': return (
        <EmployeeManagement 
          user={user!} 
          users={users} 
          onAddEmployee={(u) => setUsers(prev => [...prev, u])}
          onApproveUser={handleApproveUser}
          onRejectUser={handleRejectUser}
          onDeleteEmployee={handleDeleteUser}
        />
      );
      case 'reports': return <SmartReports />;
      case 'branches': return (
        <BranchManagement 
          branches={branches} 
          onAddBranch={handleAddBranch} 
          onUpdateBranch={handleUpdateBranch}
          onDeleteBranch={handleDeleteBranch}
          onToggleBranch={(id) => setBranches(prev => prev.map(b => b.id === id ? {...b, isActive: !b.isActive} : b))} 
          onExtend={handleExtendSubscription} 
          onActivateSubscription={handleActivateSubscription} 
        />
      );
      case 'users_mgmt': return (
        <UserManagement 
          users={users} 
          branches={branches} 
          onAddUser={(u) => setUsers(prev => [...prev, u])} 
          onApproveUser={handleApproveUser} 
          onRejectUser={handleRejectUser} 
          onDeleteUser={handleDeleteUser}
        />
      );
      case 'settings': return <Settings user={user!} onUpdateUser={handleUpdateUser} />;
      default: return <Dashboard user={user!} branch={branch} setActiveTab={setActiveTab} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'لوحة التحكم';
      case 'attendance': return 'نظام البصمة الجغرافي';
      case 'employees': return 'إدارة القوى العاملة';
      case 'reports': return 'التقارير الذكية';
      case 'branches': return 'إدارة الاشتراكات';
      case 'users_mgmt': return 'إدارة المستخدمين';
      case 'settings': return 'إعدادات الحساب';
      default: return 'نظام البصمة';
    }
  };

  if (view === 'signup') {
    return <Signup branches={branches} onSignup={handleSignup} onNavigateToLogin={() => setView('login')} />;
  }

  if (!user) {
    return <Login users={users} onLogin={(u) => { setUser(u); setView('app'); }} onNavigateToSignup={() => setView('signup')} />;
  }

  if (user.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-['Tajawal']" dir="rtl">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse"><RefreshCw size={50} /></div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">بانتظار الموافقة</h2>
          <p className="text-slate-500 font-bold mb-8">حسابك حالياً قيد المراجعة. سيتم تفعيل حسابك بمجرد الموافقة عليه.</p>
          <div className="space-y-4">
            <a href="tel:07737523465" className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black"><PhoneCall size={20} /> اتصل بمدير النظام</a>
            <button onClick={handleLogout} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === UserRole.BRANCH_ADMIN && user.status === 'APPROVED' && !user.branchId) {
    return <BranchSetup user={user} onComplete={handleAddBranch} onLogout={handleLogout} />;
  }

  if (isSubscriptionExpired() && user.role === UserRole.BRANCH_ADMIN) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center font-['Tajawal']" dir="rtl">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8"><AlertCircle size={50} /></div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">تفعيل الاشتراك مطلوب</h2>
          <p className="text-slate-500 font-bold mb-8">عذراً، الفرع الخاص بك بحاجة إلى تفعيل الاشتراك لتتمكن من استخدام المنظومة.</p>
          <div className="space-y-4">
             <button onClick={() => window.open('https://wa.me/9647737523465', '_blank')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-2"><MessageSquare size={20} /> تواصل مع سجاد (مدير النظام)</button>
             <button onClick={handleLogout} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black">العودة للدخول</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Tajawal'] text-slate-900" dir="rtl">
      <Sidebar role={user.role} activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onLogout={handleLogout} />
      <div className={`transition-all duration-300 lg:mr-72 flex flex-col min-h-screen`}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600"><Menu size={24} /></button>
            <div>
              <h1 className="text-xl font-black text-slate-900">{getPageTitle()}</h1>
              {branch && <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider">{branch.name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><UserIcon size={16} /></div>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-blue-900">{user.name}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full pb-24">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;