import React from 'react';
import { useForm } from '@inertiajs/react';

export default function SectionPerfil({ user }) {
    const { data, setData, post, processing } = useForm({
        name: user.name,
        email: user.email,
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Cambié la ruta para asegurar que coincida con tu web.php
        post(route('profile.update'), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="max-w-md mx-auto space-y-6">
            <h3 className="text-2xl font-black text-center mb-8 text-purple-500 italic">Mi Perfil</h3>
            <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-2">Nombre</label>
                <input value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-[#0F1016] border border-purple-900/20 rounded-2xl p-4 text-white" />
            </div>
            <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-2">Email</label>
                <input value={data.email} onChange={e => setData('email', e.target.value)} className="w-full bg-[#0F1016] border border-purple-900/20 rounded-2xl p-4 text-white text-sm" />
            </div>
            <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-2">Nueva Contraseña</label>
                <input type="password" placeholder="••••••••" onChange={e => setData('password', e.target.value)} className="w-full bg-[#0F1016] border border-purple-900/20 rounded-2xl p-4 text-white" />
            </div>
            <button disabled={processing} className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black transition-all shadow-lg uppercase tracking-widest text-sm">Actualizar Datos</button>
        </form>
    );
}