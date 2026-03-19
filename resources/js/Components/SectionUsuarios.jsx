import React from 'react';

export default function SectionUsuarios({ data, metrics, onDelete }) {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-slate-500/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Registrados</p>
                    <p className="text-3xl font-black">{metrics.total}</p>
                </div>
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-slate-500/10">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Emails Verificados</p>
                    <p className="text-3xl font-black">{metrics.activos}</p>
                </div>
                <div className="bg-[#0F1016] p-6 rounded-3xl border border-slate-500/10">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Último Mes</p>
                    <p className="text-3xl font-black">+{metrics.nuevos}</p>
                </div>
            </div>

            <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                    <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                        <th className="px-6 py-3">Nombre</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.id} className="bg-[#0F1016] hover:bg-[#15161f] transition-colors">
                            <td className="px-6 py-4 rounded-l-2xl font-bold text-sm">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-400">{user.email}</td>
                            <td className="px-6 py-4 rounded-r-2xl text-right">
                                <button onClick={() => onDelete(user.id, 'user')} className="text-red-500/50 hover:text-red-500 font-black text-[10px] uppercase">Banear</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}