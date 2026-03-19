import React from 'react';

export default function SectionLugares({ data, metrics, onDelete }) {
    return (
        <div className="animate-in fade-in duration-500">
            {/* ESTADÍSTICAS DE LA SECCIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-purple-500/10">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Total Lugares</p>
                    <p className="text-3xl font-black">{metrics.total}</p>
                </div>
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-purple-500/10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">En Medellín</p>
                    <p className="text-3xl font-black">{metrics.medellin}</p>
                </div>
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-purple-500/10">
                    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-1">Puntuación Top</p>
                    <p className="text-3xl font-black">{metrics.populares} <span className="text-sm text-slate-500 font-medium">Sitios</span></p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                            <th className="px-6 py-3">Lugar</th>
                            <th className="px-6 py-3">Ciudad</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((lugar) => (
                            <tr key={lugar.id} className="bg-[#0F1016] hover:bg-[#15161f] transition-colors group">
                                <td className="px-6 py-4 rounded-l-2xl font-bold text-sm">{lugar.nombre}</td>
                                <td className="px-6 py-4 text-sm text-slate-400 font-medium">{lugar.ciudad}</td>
                                <td className="px-6 py-4 rounded-r-2xl text-right">
                                    <button 
                                        onClick={() => onDelete(lugar.id, 'lugar')}
                                        className="text-red-500/50 hover:text-red-500 font-black text-[10px] uppercase transition"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}