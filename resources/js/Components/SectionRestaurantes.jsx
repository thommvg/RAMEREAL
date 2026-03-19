import React from 'react';

export default function SectionRestaurantes({ data, metrics, onDelete }) {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-indigo-500/10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Restaurantes</p>
                    <p className="text-3xl font-black">{metrics.total}</p>
                </div>
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-indigo-500/10">
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">En Itagüí</p>
                    <p className="text-3xl font-black">{metrics.itaguí}</p>
                </div>
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-indigo-500/10">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Top Rated</p>
                    <p className="text-3xl font-black">{metrics.top_rated}</p>
                </div>
            </div>

            <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                    <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                        <th className="px-6 py-3">Restaurante</th>
                        <th className="px-6 py-3">Ciudad</th>
                        <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((res) => (
                        <tr key={res.id} className="bg-[#0F1016] hover:bg-[#15161f] transition-colors group">
                            <td className="px-6 py-4 rounded-l-2xl font-bold text-sm">{res.nombre}</td>
                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">{res.ciudad}</td>
                            <td className="px-6 py-4 rounded-r-2xl text-right">
                                <button onClick={() => onDelete(res.id, 'restaurante')} className="text-red-500/50 hover:text-red-500 font-black text-[10px] uppercase">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}