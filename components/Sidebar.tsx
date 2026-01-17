
import React from 'react';
import { LayoutDashboard, Users, FileBarChart, Clock, Settings, LogOut, ShieldCheck, X, Building2, UserCog } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, isOpen, setIsOpen, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'attendance', label: 'تسجيل الحضور', icon: Clock },
    ...(role === UserRole.SUPER_ADMIN ? [
      { id: 'branches', label: 'إدارة الفروع', icon: Building2 },
      { id: 'users_mgmt', label: 'إدارة المستخدمين', icon: UserCog },
    ] : []),
    ...(role !== UserRole.EMPLOYEE ? [
      { id: 'employees', label: 'إدارة الموظفين', icon: Users },
      { id: 'reports', label: 'التقارير الذكية', icon: FileBarChart },
    ] : []),
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-slate-200 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <span className="font-black text-xl text-slate-900">بصمة تك</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 border-2 ${
                activeTab === item.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-red-600 font-bold hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;