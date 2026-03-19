import React from 'react';
import { useForm, router } from '@inertiajs/react';

export default function SectionAdmins({ data, currentId, onDelete }) {
    const { data: formData, setData, post, processing, reset } = useForm({
        name: '', email: '', password: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/admins/store', { onSuccess: () => reset() });
    };

    const toggleAdmin = (id) => router.patch(`/admin/admins/toggle/${id}`, {}, { preserveScroll: true });

    return (
        <section className="space-y-8">
            <h3 className="text-2xl font-black text-purple-500">Gestión de Administradores</h3>
            
            {/* Formulario Compacto */}
            <form onSubmit={submit} className="bg-[#252631] p-6 rounded-3xl flex flex-wrap gap-4 items-end border border-purple-500/10">
                <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Nombre</label>
                    <input value={formData.name} onChange={e => setData('name', e.target.value)} className="w-full bg-[#0F1016] border-none rounded-xl p-3 mt-1 text-sm" required />
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Email</label>
                    <input type="email" value={formData.email} onChange={e => setData('email', e.target.value)} className="w-full bg-[#0F1016] border-none rounded-xl p-3 mt-1 text-sm" required />
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Clave</label>
                    <input type="password" value={formData.password} onChange={e => setData('password', e.target.value)} className="w-full bg-[#0F1016] border-none rounded-xl p-3 mt-1 text-sm" required />
                </div>
                <button disabled={processing} className="bg-purple-600 px-6 py-3 rounded-xl font-black hover:bg-purple-500 transition">Añadir</button>
            </form>

            {/* Tabla */}
            <table className="w-full">
                <thead>
                    <tr className="text-slate-500 text-[10px] font-black uppercase border-b border-purple-900/10">
                        <th className="pb-4 px-2 text-left">Admin</th>
                        <th className="pb-4 px-2 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(admin => (
                        <tr key={admin.id} className="border-b border-purple-900/5 hover:bg-purple-500/5 transition">
                            <td className="py-4 px-2">
                                <div className="font-bold">{admin.name}</div>
                                <div className="text-xs text-slate-500">{admin.email}</div>
                            </td>
                            <td className="py-4 px-2 text-right space-x-2">
                                {admin.id !== currentId && (
                                    <>
                                        <button onClick={() => toggleAdmin(admin.id)} className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg hover:bg-amber-500 hover:text-white transition">
                                            {admin.role === 'admin' ? 'Bajar a User' : 'Hacer Admin'}
                                        </button>
                                        <button onClick={() => onDelete(admin.id, 'user')} className="text-[9px] font-black uppercase text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-lg hover:bg-rose-500 hover:text-white transition">Borrar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}