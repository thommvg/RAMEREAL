import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';

// Importación de componentes
import StatCard from '@/Components/StatCard';
import SectionLugares from '@/Components/SectionLugares';
import SectionRestaurantes from '@/Components/SectionRestaurantes';
import SectionMensajes from '@/Components/SectionMensajes';
import SectionUsuarios from '@/Components/SectionUsuarios';
import SectionAdmins from '@/Components/SectionAdmins';
import SectionPerfil from '@/Components/SectionPerfil';

export default function DashboardReal(props) {
    const { auth } = usePage().props;
    const [view, setView] = useState('welcome');

    const handleDelete = (id, tipo) => {
        if (confirm(`¿Estás seguro de eliminar este ${tipo}?`)) {
            const routes = {
                lugar: 'admin.lugar.delete',
                restaurante: 'admin.restaurante.delete',
                mensaje: 'admin.mensaje.delete',
                user: 'admin.user.delete'
            };
            router.delete(route(routes[tipo], id), { preserveScroll: true });
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1016] text-white font-sans pb-20">
            <Head title="RAME - Panel de Administración" />

            {/* HEADER */}
            <header className="bg-[#1A1B23] border-b border-purple-900/30 px-8 py-6 flex justify-between items-center shadow-2xl sticky top-0 z-50">
                <h1 
                    onClick={() => setView('welcome')} 
                    className="text-2xl font-black text-purple-500 italic cursor-pointer tracking-tighter hover:scale-105 transition-all uppercase"
                >
                    RAME.
                </h1>
                
                <div className="flex items-center gap-6">
                    <button onClick={() => router.post(route('logout'))} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-purple-400">
                        Cerrar Sesión
                    </button>
                    <div className="flex items-center gap-3 bg-[#252631] px-4 py-2 rounded-full border border-purple-500/20">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold uppercase shadow-inner">
                            {auth.user.name[0]}
                        </div>
                        <span className="text-sm font-bold tracking-tight">{auth.user.name}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12">
                {view === 'welcome' ? (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-12">
                            <h2 className="text-4xl font-black tracking-tight uppercase leading-none">
                                Bienvenido, <span className="text-purple-500 italic">{auth.user.name}</span>
                            </h2>
                            <p className="text-slate-500 mt-3 font-medium text-lg">
                                Gestión de la plataforma <span className="text-slate-300 tracking-widest">RAME</span>. Selecciona una categoría:
                            </p>
                        </div>

                        {/* ACCESOS DIRECTOS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard title="Lugares" count={props.stats.lugares} icon="📍" onClick={() => setView('lugares')} />
                            <StatCard title="Restaurantes" count={props.stats.restaurantes} icon="🍴" onClick={() => setView('restaurantes')} />
                            <StatCard title="Mensajes" count={props.stats.mensajes} icon="✉️" onClick={() => setView('mensajes')} />
                            <StatCard title="Usuarios" count={props.stats.usuarios} icon="👤" onClick={() => setView('usuarios')} />
                            <StatCard title="Administradores" count={props.stats.admins} icon="🔑" onClick={() => setView('admins')} />
                            <StatCard title="Mi Perfil" count="Ajustes" icon="⚙️" onClick={() => setView('perfil')} />
                        </div>
                    </section>
                ) : (
                    <div className="animate-in zoom-in duration-300">
                        <button 
                            onClick={() => setView('welcome')} 
                            className="mb-8 text-purple-400 font-black flex items-center gap-2 hover:translate-x-[-6px] transition-all italic uppercase text-xs tracking-widest"
                        >
                            ← Volver al Menú
                        </button>
                        
                        <div className="bg-[#1A1B23] rounded-[40px] p-10 border border-purple-900/20 shadow-2xl">
                            {view === 'lugares' && <SectionLugares data={props.lugares} metrics={props.lugares_metrics} onDelete={handleDelete} />}
                            {view === 'restaurantes' && <SectionRestaurantes data={props.restaurantes} metrics={props.restaurantes_metrics} onDelete={handleDelete} />}
                            {view === 'mensajes' && <SectionMensajes data={props.mensajes_lista} metrics={props.mensajes_metrics} onDelete={handleDelete} />}
                            {view === 'usuarios' && <SectionUsuarios data={props.usuarios_lista} metrics={props.usuarios_metrics} onDelete={handleDelete} />}
                            {view === 'admins' && <SectionAdmins data={props.admins_lista} currentId={auth.user.id} onDelete={handleDelete} />}
                            {view === 'perfil' && <SectionPerfil user={auth.user} />}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}