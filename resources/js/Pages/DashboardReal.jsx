import React, { useState } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';

export default function DashboardReal({ stats, lugares, restaurantes, usuarios_lista, admins_lista, mensajes_lista }) {
    const { auth } = usePage().props;
    const [view, setView] = useState('welcome');

    // Formularios
    const profileForm = useForm({ name: auth.user.name, email: auth.user.email, password: '' });
    const adminForm = useForm({ name: '', email: '', password: '' });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post('/admin/profile/update', { preserveScroll: true });
    };

    const submitNewAdmin = (e) => {
        e.preventDefault();
        adminForm.post('/admin/admins/store', {
            onSuccess: () => {
                alert('Nuevo Administrador creado');
                adminForm.reset();
            }
        });
    };

    const handleDelete = (id, tipo) => {
        if (confirm(`¿Eliminar este ${tipo}?`)) {
            const routeMap = { 'lugar': 'lugar', 'restaurante': 'restaurante', 'user': 'usuario', 'mensaje': 'mensaje' };
            router.delete(`/admin/${routeMap[tipo]}/${id}`);
        }
    };

    const handleToggle = (id) => {
        router.patch(`/admin/admins/toggle/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#0F1016] text-white font-sans pb-10">
            <Head title="RAME - Admin Hub" />

            {/* HEADER */}
            <header className="bg-[#1A1B23] border-b border-purple-900/30 px-8 py-6 flex justify-between items-center shadow-2xl">
                <h1 onClick={() => setView('welcome')} className="text-2xl font-black text-purple-500 italic cursor-pointer tracking-tighter hover:scale-105 transition">RAME.</h1>
                <div className="flex items-center gap-6">
                    <button onClick={() => router.post('/logout')} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-purple-400 transition">Cerrar Sesión</button>
                    <div className="flex items-center gap-3 bg-[#252631] px-4 py-2 rounded-full border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">{auth.user.name[0]}</div>
                        <span className="text-sm font-bold">{auth.user.name}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12">
                {view === 'welcome' ? (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-4xl font-black mb-10 tracking-tight">Panel de <span className="text-purple-500">Administración</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Lugares" count={stats.lugares} icon="📍" onClick={() => setView('lugares')} />
                            <StatCard title="Restaurantes" count={stats.restaurantes} icon="🍴" onClick={() => setView('restaurantes')} />
                            <StatCard title="Mensajes" count={stats.mensajes} icon="✉️" onClick={() => setView('mensajes')} />
                            <StatCard title="Usuarios" count={stats.usuarios} icon="👤" onClick={() => setView('usuarios')} />
                            <StatCard title="Admins" count={stats.admins} icon="🔑" onClick={() => setView('admins')} />
                            <StatCard title="Mi Perfil" count="Editar" icon="⚙️" onClick={() => setView('perfil')} />
                        </div>
                    </section>
                ) : (
                    <div className="animate-in zoom-in duration-300">
                        <button onClick={() => setView('welcome')} className="mb-8 text-purple-400 font-bold flex items-center gap-2 hover:translate-x-[-5px] transition-all">
                            ← Volver al Hub
                        </button>
                        
                        <div className="bg-[#1A1B23] rounded-[30px] p-10 border border-purple-900/20 shadow-2xl">
                            {view === 'perfil' ? (
                                <form onSubmit={submitProfile} className="max-w-md mx-auto space-y-6">
                                    <h3 className="text-2xl font-black text-center mb-8 text-purple-500">Mi Perfil</h3>
                                    <AdminInput label="Nombre" value={profileForm.data.name} onChange={e => profileForm.setData('name', e.target.value)} />
                                    <AdminInput label="Email" type="email" value={profileForm.data.email} onChange={e => profileForm.setData('email', e.target.value)} />
                                    <AdminInput label="Cambiar Clave" type="password" value={profileForm.data.password} onChange={e => profileForm.setData('password', e.target.value)} />
                                    <button className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black transition-all shadow-lg">Actualizar Datos</button>
                                </form>
                            ) : view === 'admins' ? (
                                <section className="space-y-10">
                                    <form onSubmit={submitNewAdmin} className="bg-[#252631] p-6 rounded-3xl flex flex-wrap gap-4 items-end border border-purple-500/10">
                                        <div className="flex-1 min-w-[200px]"><AdminInput label="Nombre" value={adminForm.data.name} onChange={e => adminForm.setData('name', e.target.value)} /></div>
                                        <div className="flex-1 min-w-[200px]"><AdminInput label="Email" value={adminForm.data.email} onChange={e => adminForm.setData('email', e.target.value)} /></div>
                                        <div className="flex-1 min-w-[200px]"><AdminInput label="Clave" type="password" value={adminForm.data.password} onChange={e => adminForm.setData('password', e.target.value)} /></div>
                                        <button type="submit" className="bg-purple-600 px-8 py-4 rounded-2xl font-black h-[58px] hover:bg-purple-500 transition">Añadir</button>
                                    </form>
                                    <AdminTable 
                                        list={admins_lista} 
                                        onToggle={handleToggle}
                                        onDelete={(id) => handleDelete(id, 'user')} 
                                        currentId={auth.user.id} 
                                        isAdminView={true}
                                    />
                                </section>
                            ) : (
                                <AdminTable 
                                    list={view === 'lugares' ? lugares : view === 'restaurantes' ? restaurantes : view === 'usuarios' ? usuarios_lista : mensajes_lista} 
                                    onDelete={(id) => handleDelete(id, view === 'usuarios' ? 'user' : view.slice(0,-1))} 
                                    currentId={auth.user.id}
                                />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// COMPONENTES AUXILIARES
function StatCard({ title, count, icon, onClick }) {
    return (
        <div onClick={onClick} className="bg-[#1A1B23] p-8 rounded-[35px] border border-purple-900/20 hover:border-purple-500/50 transition-all cursor-pointer group shadow-lg">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
            <h4 className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">{title}</h4>
            <div className="text-3xl font-black text-white">{count}</div>
        </div>
    );
}

function AdminInput({ label, type = "text", value, onChange }) {
    return (
        <div className="w-full">
            <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-2">{label}</label>
            <input type={type} value={value} onChange={onChange} className="w-full bg-[#0F1016] border border-purple-900/20 rounded-2xl p-4 focus:border-purple-500 transition text-sm text-white focus:ring-0 shadow-inner" />
        </div>
    );
}

function AdminTable({ list, onDelete, onToggle, currentId, isAdminView }) {
    return (
        <table className="w-full text-left">
            <thead>
                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-purple-900/10">
                    <th className="pb-6 px-4">Información</th>
                    {isAdminView && <th className="pb-6 px-4 text-center">Rango</th>}
                    <th className="pb-6 px-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {list.map(item => (
                    <tr key={item.id} className="border-b border-purple-900/5 hover:bg-purple-500/5 transition">
                        <td className="py-5 px-4">
                            <span className="font-bold text-slate-200">{item.nombre || item.name}</span>
                            <span className="block text-xs text-slate-500">{item.email || item.ciudad || item.correo}</span>
                        </td>
                        {isAdminView && (
                            <td className="py-5 px-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>
                                    {item.role}
                                </span>
                            </td>
                        )}
                        <td className="py-5 px-4 text-right space-x-2">
                            {onToggle && item.id !== currentId && (
                                <button 
                                    onClick={() => onToggle(item.id)} 
                                    className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl transition ${item.role === 'admin' ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-white' : 'text-purple-400 bg-purple-500/10 hover:bg-purple-500 hover:text-white'}`}
                                >
                                    {item.role === 'admin' ? 'Quitar Rango' : 'Hacer Admin'}
                                </button>
                            )}
                            {item.id !== currentId && (
                                <button onClick={() => onDelete(item.id)} className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-4 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition">Borrar</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}