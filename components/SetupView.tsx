
import React, { useState, useRef, useMemo } from 'react';
import { Participant } from '../types';
import { ClipboardList, ChevronRight, FileSpreadsheet, Users, Trash2, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  participants: Participant[];
  onUpdateParticipants: (names: string[]) => void;
  onContinue: () => void;
}

const SetupView: React.FC<Props> = ({ participants, onUpdateParticipants, onContinue }) => {
  const [rawText, setRawText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模擬名單數據
  const mockNames = [
    "陳小明", "林美玲", "李冠宇", "王雅婷", "張家豪", 
    "劉宜君", "黃柏翰", "蔡淑惠", "吳信宏", "鄭羽彤",
    "郭建志", "謝宜芳", "曾冠傑", "洪于婷", "邱品妤",
    "蘇煜翔", "葉詩涵", "江志強", "呂佩珊", "潘佳琪"
  ];

  const handleMockData = () => {
    const text = mockNames.join('\n');
    setRawText(text);
    onUpdateParticipants(mockNames);
  };

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRawText(text);
    const names = text.split(/[\n,]/).map(n => n.trim()).filter(n => n.length > 0);
    onUpdateParticipants(names);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text);
      const names = text.split(/[\n,]/).map(n => n.trim()).filter(n => n.length > 0);
      onUpdateParticipants(names);
    };
    reader.readAsText(file);
  };

  // 偵測重複姓名
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => counts.set(p.name, (counts.get(p.name) || 0) + 1));
    return new Set([...counts.entries()].filter(([_, count]) => count > 1).map(([name]) => name));
  }, [participants]);

  const handleRemoveDuplicates = () => {
    const uniqueNames = Array.from(new Set(participants.map(p => p.name)));
    setRawText(uniqueNames.join('\n'));
    onUpdateParticipants(uniqueNames);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">名單設定</h2>
        <p className="text-slate-500">上傳 CSV 或貼上姓名，開始您的抽籤或分組活動。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <ClipboardList className="w-5 h-5" />
              <h3>貼上名單</h3>
            </div>
            <button 
              onClick={handleMockData}
              className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              使用範例名單
            </button>
          </div>
          <p className="text-sm text-slate-500">請輸入姓名，用換行或逗號分隔。</p>
          <textarea
            value={rawText}
            onChange={handlePaste}
            placeholder="王小明&#10;李小華&#10;張大同..."
            className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 hover:border-indigo-400 transition-colors group cursor-pointer h-40" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv,.txt" 
              className="hidden" 
            />
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">上傳 CSV / TXT</h3>
              <p className="text-xs text-slate-500">點擊或拖放檔案至此</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                名單預覽
              </h3>
              <div className="flex items-center gap-2">
                {duplicateNames.size > 0 && (
                  <button 
                    onClick={handleRemoveDuplicates}
                    className="text-xs flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    移除重複項
                  </button>
                )}
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                  {participants.length} 人
                </span>
              </div>
            </div>
            
            <div className="flex-1 max-h-48 overflow-y-auto space-y-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
              {participants.length > 0 ? (
                participants.map((p, idx) => {
                  const isDuplicate = duplicateNames.has(p.name);
                  return (
                    <div key={p.id} className={`text-sm flex justify-between items-center p-1 rounded ${isDuplicate ? 'bg-red-50' : ''}`}>
                      <span className={isDuplicate ? 'text-red-700 font-medium' : 'text-slate-600'}>
                        {idx + 1}. {p.name}
                      </span>
                      {isDuplicate && (
                        <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <AlertCircle className="w-2 h-2" />
                          重複
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-slate-400 italic text-center py-4">尚未加入任何名單</div>
              )}
            </div>

            <button
              disabled={participants.length === 0}
              onClick={onContinue}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
            >
              確認名單並開始
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
