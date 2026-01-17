
import React, { useState } from 'react';
import { getAttendanceSummary } from '../services/geminiService';
import { INITIAL_RECORDS } from '../constants';
import { Sparkles, Loader2, FileText, Send, BrainCircuit, RefreshCw } from 'lucide-react';

const SmartReports: React.FC = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    const summary = await getAttendanceSummary(INITIAL_RECORDS);
    setReport(summary || "فشل في إنشاء التقرير.");
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <BrainCircuit size={200} />
        </div>
        <div className="relative z-10 text-right">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Sparkles className="text-amber-400" />
            تحليلات الذكاء الاصطناعي
          </h2>
          <p className="text-blue-100 font-medium">قم بإنشاء تقارير ذكية حول أداء الموظفين ومدى الالتزام في ثوانٍ</p>
        </div>
        <button
          onClick={generateReport}
          disabled={loading}
          className="relative z-10 flex items-center gap-3 px-8 py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl disabled:opacity-70 group"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
          )}
          {loading ? 'جاري التحليل...' : 'إنشاء تقرير ذكي'}
        </button>
      </div>

      {report ? (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 prose prose-slate max-w-none animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 m-0">التقرير الذكي للفترة الحالية</h3>
                <p className="text-sm text-slate-500 m-0">تم إنشاؤه بواسطة Gemini AI</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-all">
              <Send size={18} />
              مشاركة مع الإدارة
            </button>
          </div>
          
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
            {report}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-20 rounded-[2rem] text-center">
          <BrainCircuit size={64} className="mx-auto text-slate-300 mb-6" />
          <h3 className="text-xl font-bold text-slate-400">لا يوجد تقرير حالياً</h3>
          <p className="text-slate-400 max-w-xs mx-auto mt-2">اضغط على زر "إنشاء تقرير ذكي" لتحليل بيانات الحضور والانصراف تلقائياً</p>
        </div>
      )}
    </div>
  );
};

export default SmartReports;