
import React, { useState, useEffect, useRef } from 'react';
import { User, Branch } from '../types';
import { Building2, MapPin, Navigation, Loader2, ArrowRight, X, Check, Search } from 'lucide-react';

interface BranchSetupProps {
  user: User;
  onComplete: (branch: Branch) => void;
  onLogout: () => void;
}

const BranchSetup: React.FC<BranchSetupProps> = ({ user, onComplete, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lat: 33.3128, // موقع افتراضي (بغداد) في حال فشل الـ GPS
    lng: 44.3615,
    radius: 300,
    hasLocation: false
  });

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  // تهيئة الخريطة عند فتح النافذة المنبثقة
  useEffect(() => {
    if (showMap && !mapRef.current) {
      setTimeout(() => {
        const L = (window as any).L;
        const map = L.map('map-picker').setView([formData.lat, formData.lng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const marker = L.marker([formData.lat, formData.lng], { draggable: true }).addTo(map);
        const circle = L.circle([formData.lat, formData.lng], {
          radius: formData.radius,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.2
        }).addTo(map);

        marker.on('dragend', (e: any) => {
          const position = e.target.getLatLng();
          setFormData(prev => ({ ...prev, lat: position.lat, lng: position.lng, hasLocation: true }));
          circle.setLatLng(position);
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          circle.setLatLng(e.latlng);
          setFormData(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng, hasLocation: true }));
        });

        mapRef.current = map;
        markerRef.current = marker;
        circleRef.current = circle;

        // محاولة جلب الموقع الحالي تلقائياً عند فتح الخريطة
        handleQuickLocate();
      }, 100);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showMap]);

  // تحديث دائرة القطر عند تغيير القيمة
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(formData.radius);
    }
  }, [formData.radius]);

  const handleQuickLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData(prev => ({ ...prev, lat: latitude, lng: longitude, hasLocation: true }));
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 17);
            markerRef.current.setLatLng([latitude, longitude]);
            circleRef.current.setLatLng([latitude, longitude]);
          }
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hasLocation) {
      alert('يرجى تحديد موقع الفرع على الخريطة أولاً');
      return;
    }
    setLoading(true);
    
    const newBranch: Branch = {
      id: 'b' + Date.now(),
      name: formData.name,
      lat: formData.lat,
      lng: formData.lng,
      radius: formData.radius,
      managerId: user.id,
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      isPaid: false
    };

    setTimeout(() => {
      onComplete(newBranch);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Tajawal']" dir="rtl">
      <div className="max-w-2xl w-full bg-white p-8 sm:p-12 rounded-[3.5rem] shadow-2xl border border-blue-50 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100 mb-6">
            <Building2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">أهلاً بك يا {user.name}</h2>
          <p className="text-slate-500 mt-2 font-bold">تأسيس مقر العمل (الفرع)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">اسم المنشأة</label>
              <input 
                type="text" required
                placeholder="مثال: صيدلية اللباب"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setShowMap(true)}
                className={`flex items-center justify-center gap-3 px-5 py-4 rounded-2xl font-black border-2 transition-all ${
                  formData.hasLocation 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                  : 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                }`}
              >
                {formData.hasLocation ? <Check size={20} /> : <Navigation size={20} />}
                {formData.hasLocation ? 'تم تحديد الموقع' : 'تحديد الموقع (GPS الخرائط)'}
              </button>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">نصف قطر البصمة (متر)</label>
                <input 
                  type="number" required min="50" max="5000"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900"
                  value={formData.radius}
                  onChange={e => setFormData({...formData, radius: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {formData.hasLocation && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="text-emerald-600" size={20} />
                  <p className="text-xs font-bold text-emerald-700">تم تحديد الإحداثيات بدقة</p>
                </div>
                <button type="button" onClick={() => setShowMap(true)} className="text-[10px] font-black text-emerald-600 underline">تعديل</button>
              </div>
            )}
          </div>

          <div className="pt-4 space-y-3">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={24} />}
              تأسيس الفرع والبدء
            </button>
            
            <button 
              type="button" 
              onClick={onLogout}
              className="w-full py-3 text-slate-400 font-bold text-sm hover:text-red-500 transition-all flex items-center justify-center gap-2"
            >
              تسجيل الخروج
            </button>
          </div>
        </form>
      </div>

      {/* نافذة الخريطة التفاعلية */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[80vh] animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Navigation size={20} /></div>
                <div>
                  <h3 className="font-black text-slate-900">اختر موقع الفرع بدقة</h3>
                  <p className="text-[10px] text-slate-400 font-bold">يمكنك تحريك العلامة أو النقر على الموقع</p>
                </div>
              </div>
              <button onClick={() => setShowMap(false)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>
            
            <div className="flex-1 relative">
              <div id="map-picker" className="absolute inset-0"></div>
              <button 
                onClick={handleQuickLocate}
                className="absolute bottom-6 right-6 z-[10] bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2 font-black text-sm"
              >
                <Navigation size={18} />
                موقعي الحالي
              </button>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase">الإحداثيات الحالية</p>
                <p className="text-xs font-black text-slate-700 font-mono">{formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}</p>
              </div>
              <button 
                onClick={() => setShowMap(false)}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Check size={20} />
                تأكيد الموقع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSetup;