
import React, { useState, useEffect, useRef } from 'react';
import { Branch } from '../types';
import { Building2, Calendar, Plus, X, MapPin, Navigation, Trash2, Edit3, Check, Clock, CreditCard } from 'lucide-react';

interface BranchManagementProps {
  branches: Branch[];
  onAddBranch: (branch: Branch) => void;
  onUpdateBranch: (branch: Branch) => void;
  onDeleteBranch: (id: string) => void;
  onToggleBranch: (id: string) => void;
  onExtend: (id: string, months: number) => void;
  onActivateSubscription: (id: string) => void;
}

const BranchManagement: React.FC<BranchManagementProps> = ({ 
  branches, onAddBranch, onUpdateBranch, onDeleteBranch, onToggleBranch, onExtend, onActivateSubscription 
}) => {
  const [showModal, setShowModal] = useState<'add' | 'edit' | 'extend' | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [extendMonths, setExtendMonths] = useState(1);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    lat: 33.3128,
    lng: 44.3615,
    radius: 300
  });

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  // تحديث الخريطة عند الفتح
  useEffect(() => {
    if (showMap && !mapRef.current) {
      setTimeout(() => {
        const L = (window as any).L;
        const initialLat = formData.lat || 33.3128;
        const initialLng = formData.lng || 44.3615;
        
        const map = L.map('map-picker-admin').setView([initialLat, initialLng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
        const circle = L.circle([initialLat, initialLng], {
          radius: formData.radius,
          color: '#3b82f6',
          fillOpacity: 0.2
        }).addTo(map);

        marker.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          setFormData(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
          circle.setLatLng(pos);
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          circle.setLatLng(e.latlng);
          setFormData(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
        });

        mapRef.current = map;
        markerRef.current = marker;
        circleRef.current = circle;
      }, 150);
    }
    return () => { 
      if (mapRef.current) { 
        mapRef.current.remove(); 
        mapRef.current = null; 
      } 
    };
  }, [showMap]);

  // تحديث دائرة القطر عند التغيير
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(formData.radius);
    }
  }, [formData.radius]);

  const openEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      lat: branch.lat,
      lng: branch.lng,
      radius: branch.radius
    });
    setShowModal('edit');
  };

  const openAdd = () => {
    setEditingBranch(null);
    setFormData({ name: '', lat: 33.3128, lng: 44.3615, radius: 300 });
    setShowModal('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showModal === 'add') {
      onAddBranch({
        id: 'b' + Date.now(),
        name: formData.name,
        lat: formData.lat,
        lng: formData.lng,
        radius: formData.radius,
        managerId: '',
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
        isPaid: false
      });
    } else if (showModal === 'edit' && editingBranch) {
      onUpdateBranch({
        ...editingBranch,
        name: formData.name,
        lat: formData.lat,
        lng: formData.lng,
        radius: formData.radius
      });
    }
    setShowModal(null);
  };

  const calculateRemainingDays = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">إدارة الفروع والاشتراكات</h2>
          <p className="text-slate-500 font-medium">إدارة المواقع الجغرافية وتراخيص النظام</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:scale-105 transition-all">
          <Plus size={20} /> إضافة فرع
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => {
          const daysLeft = calculateRemainingDays(branch.subscriptionEnd);
          const isExpired = daysLeft <= 0;

          return (
            <div key={branch.id} className={`bg-white rounded-[2.5rem] border-2 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 ${isExpired ? 'border-red-100' : 'border-slate-50'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isExpired ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 line-clamp-1">{branch.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {branch.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(branch)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all" title="تعديل">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => onDeleteBranch(branch.id)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all" title="حذف">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400">تاريخ الانتهاء</span>
                    <span className="text-xs font-black text-slate-700">{branch.subscriptionEnd}</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl font-black text-[10px] ${isExpired ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {isExpired ? 'منتهي' : `${daysLeft} يوم متبقي`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setSelectedBranchId(branch.id); setShowModal('extend'); }} 
                  className="col-span-2 py-3 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-50 active:scale-95 transition-all"
                >
                  تمديد الاشتراك
                </button>
                <button 
                  onClick={() => onToggleBranch(branch.id)} 
                  className={`py-2 rounded-xl font-black text-[10px] border transition-all ${branch.isActive ? 'border-amber-100 text-amber-600 hover:bg-amber-50' : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'}`}
                >
                  {branch.isActive ? 'تعطيل الفرع' : 'تفعيل الفرع'}
                </button>
                { !branch.isPaid && (
                  <button onClick={() => onActivateSubscription(branch.id)} className="py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] hover:bg-emerald-700">تنشيط الدفع</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(showModal === 'add' || showModal === 'edit') && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900">{showModal === 'add' ? 'إضافة فرع جديد' : 'تعديل الفرع'}</h3>
              <button onClick={() => setShowModal(null)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">اسم الفرع</label>
                <input type="text" required className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">نطاق البصمة (متر)</label>
                  <input type="number" required placeholder="300" className="w-full px-5 py-4 bg-slate-50 rounded-2xl focus:border-blue-600 outline-none font-bold" value={formData.radius} onChange={e => setFormData({...formData, radius: parseInt(e.target.value)})} />
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={() => setShowMap(true)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                    <Navigation size={18} /> الخريطة
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">حفظ البيانات</button>
            </form>
          </div>
        </div>
      )}

      {showMap && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] h-[85vh] flex flex-col shadow-2xl overflow-hidden border-2 border-slate-100 animate-in zoom-in duration-300">
             <div className="p-6 border-b flex justify-between items-center bg-white relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Navigation size={20} /></div>
                  <h3 className="font-black text-slate-900">تحديد الموقع الجغرافي للفرع</h3>
                </div>
                <button onClick={() => setShowMap(false)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
             </div>
             <div id="map-picker-admin" className="flex-1 relative"></div>
             <div className="p-6 bg-slate-50 border-t flex justify-end">
                <button onClick={() => setShowMap(false)} className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                  <Check size={20} /> تأكيد الموقع المختار
                </button>
             </div>
          </div>
        </div>
      )}

      {showModal === 'extend' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 space-y-6 border border-slate-100 animate-in zoom-in duration-300">
             <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900">تمديد اشتراك الفرع</h3>
                <p className="text-slate-400 font-bold text-sm">اختر عدد الأشهر المطلوب إضافتها</p>
             </div>
             <div className="grid grid-cols-3 gap-3">
                {[1, 3, 6, 12, 24].map(m => (
                  <button key={m} onClick={() => setExtendMonths(m)} className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${extendMonths === m ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-blue-200'}`}>
                    {m} {m === 1 ? 'شهر' : m <= 10 ? 'أشهر' : 'شهراً'}
                  </button>
                ))}
             </div>
             <button 
              onClick={() => { if(selectedBranchId) { onExtend(selectedBranchId, extendMonths); setShowModal(null); } }} 
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
             >
                تأكيد التمديد لـ {extendMonths} أشهر
             </button>
             <button onClick={() => setShowModal(null)} className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-all">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;