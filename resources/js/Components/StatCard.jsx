import React from 'react';

export default function StatCard({ title, count, icon, onClick }) {
    return (
        <div onClick={onClick} className="bg-[#1A1B23] p-8 rounded-[35px] border border-purple-900/20 hover:border-purple-500/50 transition-all cursor-pointer group shadow-lg">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
            <h4 className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">{title}</h4>
            <div className="text-3xl font-black text-white">{count}</div>
        </div>
    );
}