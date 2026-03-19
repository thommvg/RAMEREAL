import React from 'react';

export default function SectionMensajes({ data, metrics, onDelete }) {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-pink-500/10">
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Recibidos Hoy</p>
                    <p className="text-3xl font-black">{metrics.hoy}</p>
                </div>
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-pink-500/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Histórico</p>
                    <p className="text-3xl font-black">{metrics.total}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {data.map((msg) => (
                    <div key={msg.id} className="bg-[#0F1016] p-6 rounded-[30px] border border-white/5 hover:border-pink-500/20 transition group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-tight">{msg.nombre}</h4>
                                <p className="text-[10px] text-slate-500 font-bold tracking-widest">{msg.email}</p>
                            </div>
                            <button onClick={() => onDelete(msg.id, 'mensaje')} className="text-[10px] font-black text-red-500/40 hover:text-red-500 uppercase">Eliminar</button>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{msg.mensaje}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}