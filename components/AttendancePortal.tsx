
import React, { useState, useEffect, useCallback } from 'react';
import { Fingerprint, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Navigation, LocateFixed } from 'lucide-react';
import { Branch } from '../types';

interface AttendancePortalProps {
  branch: Branch | null;
}

const AttendancePortal: React.FC<AttendancePortalProps> = ({ branch }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [distance, setDistance] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const requestLocation = useCallback((onSuccess?: (pos: GeolocationPosition) => void) => {
    if (!navigator.geolocation) {
      setErrorMsg('الموقع غير مدعوم');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPermissionDenied(false);
        setErrorMsg('');
        if (branch) {
          const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, branch.lat, branch.lng);
          setDistance(dist);
        }
        if (onSuccess) onSuccess(pos);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg('يرجى السماح بالوصول للموقع لتسجيل البصمة. انقر هنا.');
          setPermissionDenied(true);
        } else {
          setErrorMsg('فشل تحديد الموقع، يرجى المحاولة لاحقاً.');
        }
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [branch]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleAction = () => {
    if (!branch) return;
    setStatus('scanning');
    setErrorMsg('');

    requestLocation((pos) => {
      const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, branch.lat, branch.lng);
      setDistance(dist);

      if (dist > branch.radius) {
        setErrorMsg(`أنت خارج النطاق (${Math.round(dist)} متر بعيداً)`);
        setStatus('error');
      } else {
        setTimeout(() => {
          setStatus('success');
          setIsClockedIn(!isClockedIn);
          setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4 animate-in zoom-in duration-700">
      <div className="bg-white p-8 sm:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden group">
        <div className="relative z-10">
          <div className="mb-10">
            <h2 className="text-5xl font-black text-slate-900 mb-2">
              {currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl font-black text-sm">
              <ShieldCheck size={18} />
              <span>{branch?.name || 'جاري التحميل...'}</span>
            </div>
          </div>

          <button
            onClick={handleAction}
            disabled={status === 'scanning' || status === 'success'}
            className={`w-64 h-64 rounded-[4.5rem] mx-auto flex flex-col items-center justify-center transition-all duration-500 shadow-2xl border-8 active:scale-95 ${
              status === 'scanning' ? 'bg-slate-50 border-blue-100 animate-pulse' :
              status === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
              isClockedIn ? 'bg-red-600 border-red-500 text-white' : 'bg-blue-600 border-blue-500 text-white shadow-blue-200'
            }`}
          >
            {status === 'success' ? <CheckCircle2 size={80} /> : <Fingerprint size={80} />}
            <span className="mt-4 font-black text-xs">
              {status === 'scanning' ? 'جاري التحقق...' : status === 'success' ? 'تمت البصمة' : isClockedIn ? 'تسجيل انصراف' : 'تسجيل حضور'}
            </span>
          </button>

          {errorMsg && (
            <button 
              onClick={() => permissionDenied ? requestLocation() : handleAction()}
              className="mt-8 w-full p-5 bg-red-50 text-red-700 rounded-3xl border border-red-100 flex items-center justify-center gap-3 animate-pulse"
            >
              {permissionDenied ? <LocateFixed size={24} /> : <AlertTriangle size={24} />}
              <p className="font-bold text-sm">{errorMsg}</p>
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <Navigation size={20} className="mx-auto text-blue-600 mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase">المسافة الحالية</p>
              <p className="text-sm font-black">{distance !== null ? `${Math.round(distance)} متر` : 'جاري الحساب'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <MapPin size={20} className="mx-auto text-emerald-600 mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase">النطاق المسموح</p>
              <p className="text-sm font-black">{branch?.radius || 0} متر</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePortal;