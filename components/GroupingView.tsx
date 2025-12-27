
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { LayoutGrid, Users, RefreshCw, Download, FileText, FileSpreadsheet } from 'lucide-react';

interface Props {
  participants: Participant[];
}

const GroupingView: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const performGrouping = async () => {
    setIsGenerating(true);
    
    // 隨機洗牌邏輯
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      const members = shuffled.slice(i, i + groupSize);
      newGroups.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `第 ${Math.floor(i / groupSize) + 1} 組`,
        members
      });
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    setGroups(newGroups);
    setIsGenerating(false);
  };

  const downloadAsText = () => {
    const text = groups.map(g => `${g.name}:\n${g.members.map(m => `- ${m.name}`).join('\n')}`).join('\n\n');
    downloadFile(text, 'grouping-results.txt', 'text/plain');
  };

  const downloadAsCSV = () => {
    // 建立 CSV 內容，加入 BOM 避免 Excel 開啟亂碼 (UTF-8)
    const header = "分組名稱,成員姓名\n";
    const rows = groups.flatMap(g => 
      g.members.map(m => `${g.name},${m.name}`)
    ).join('\n');
    
    const csvContent = "\ufeff" + header + rows;
    downloadFile(csvContent, 'grouping-results.csv', 'text/csv;charset=utf-8');
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">每組人數</label>
            <div className="flex items-center gap-3">
               <input 
                type="range" 
                min="2" 
                max={Math.max(2, participants.length)} 
                value={groupSize} 
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-32 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
               />
               <span className="font-black text-xl text-slate-700 w-8">{groupSize}</span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden sm:block" />
          <div className="space-y-1">
             <label className="text-xs font-bold uppercase tracking-wider text-slate-400">預計組數</label>
             <div className="font-bold text-xl text-slate-700">{Math.ceil(participants.length / groupSize)} 組</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={performGrouping}
            disabled={isGenerating}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-amber-100 flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
            隨機分組
          </button>
          
          {groups.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={downloadAsCSV}
                className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors border border-green-100 flex items-center gap-2 text-sm font-medium"
                title="下載 CSV"
              >
                <FileSpreadsheet className="w-5 h-5" />
                匯出 CSV
              </button>
              <button
                onClick={downloadAsText}
                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 flex items-center gap-2 text-sm font-medium"
                title="下載 TXT"
              >
                <FileText className="w-5 h-5" />
                TXT
              </button>
            </div>
          )}
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in zoom-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  {group.name}
                </h4>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-5 space-y-2">
                {group.members.map(member => (
                  <div key={member.id} className="text-sm text-slate-600 flex items-center gap-2 py-1 border-b border-slate-50 last:border-0">
                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] uppercase font-bold">
                      {member.name.substring(0, 1)}
                    </div>
                    {member.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400 space-y-4">
          <LayoutGrid className="w-16 h-16 opacity-20" />
          <p className="font-medium">設定人數並點擊隨機分組以產生結果</p>
        </div>
      )}
    </div>
  );
};

export default GroupingView;
