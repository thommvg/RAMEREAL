import React, { useState } from "react";
import { Head, usePage, router, useForm } from "@inertiajs/react";

export default function DashboardReal({ stats, lugares = [], restaurantes = [], usuarios_lista = [], admins_lista = [], mensajes_lista = [] }) {

    const { auth } = usePage().props;
    const [view, setView] = useState("welcome");

    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
        password: ""
    });

    const adminForm = useForm({
        name: "",
        email: "",
        password: ""
    });

    const dataMap = {
        lugares,
        restaurantes,
        usuarios: usuarios_lista,
        mensajes: mensajes_lista
    };

    const routeMap = {
        lugares: "lugar",
        restaurantes: "restaurante",
        usuarios: "usuario",
        mensajes: "mensaje"
    };

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post("/admin/profile/update");
    };

    const submitNewAdmin = (e) => {
        e.preventDefault();

        adminForm.post("/admin/admins/store", {
            onSuccess: () => {
                alert("Admin creado");
                adminForm.reset();
            }
        });
    };

    const handleDelete = (id, tipo) => {

        if (!confirm("¿Seguro que deseas eliminar esto?")) return;

        router.delete(`/admin/${routeMap[tipo]}/${id}`, {
            preserveScroll: true
        });
    };

    const handleToggle = (id) => {
        router.patch(`/admin/admins/toggle/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#0F1016] text-white pb-20">

            <Head title="Admin Dashboard" />

            {/* HEADER */}

            <header className="bg-[#1A1B23] px-8 py-6 flex justify-between items-center border-b border-purple-900/20">

                <h1
                    className="text-2xl font-black text-purple-500 cursor-pointer"
                    onClick={() => setView("welcome")}
                >
                    RAME
                </h1>

                <div className="flex items-center gap-6">

                    <button
                        onClick={() => router.post("/logout")}
                        className="text-sm text-slate-400 hover:text-purple-400"
                    >
                        Cerrar sesión
                    </button>

                    <div className="flex items-center gap-3 bg-[#252631] px-4 py-2 rounded-full">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                            {auth.user.name[0]}
                        </div>

                        <span>{auth.user.name}</span>
                    </div>

                </div>

            </header>

            {/* MAIN */}

            <main className="max-w-7xl mx-auto px-6 mt-12">

                {view === "welcome" ? (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <StatCard title="Lugares" count={stats.lugares} onClick={() => setView("lugares")} />
                        <StatCard title="Restaurantes" count={stats.restaurantes} onClick={() => setView("restaurantes")} />
                        <StatCard title="Mensajes" count={stats.mensajes} onClick={() => setView("mensajes")} />
                        <StatCard title="Usuarios" count={stats.usuarios} onClick={() => setView("usuarios")} />
                        <StatCard title="Admins" count={stats.admins} onClick={() => setView("admins")} />
                        <StatCard title="Mi Perfil" count="Editar" onClick={() => setView("perfil")} />

                    </div>

                ) : (

                    <div>

                        <button
                            onClick={() => setView("welcome")}
                            className="mb-8 text-purple-400"
                        >
                            ← Volver
                        </button>

                        <div className="bg-[#1A1B23] p-10 rounded-3xl">

                            {/* PERFIL */}

                            {view === "perfil" && (

                                <form onSubmit={submitProfile} className="max-w-md space-y-6">

                                    <AdminInput
                                        label="Nombre"
                                        value={profileForm.data.name}
                                        onChange={e => profileForm.setData("name", e.target.value)}
                                    />

                                    <AdminInput
                                        label="Email"
                                        value={profileForm.data.email}
                                        onChange={e => profileForm.setData("email", e.target.value)}
                                    />

                                    <AdminInput
                                        label="Nueva contraseña"
                                        type="password"
                                        value={profileForm.data.password}
                                        onChange={e => profileForm.setData("password", e.target.value)}
                                    />

                                    <button className="bg-purple-600 px-6 py-3 rounded-xl">
                                        Actualizar perfil
                                    </button>

                                </form>

                            )}

                            {/* ADMINS */}

                            {view === "admins" && (

                                <div className="space-y-10">

                                    <form
                                        onSubmit={submitNewAdmin}
                                        className="flex gap-4 flex-wrap"
                                    >

                                        <AdminInput
                                            label="Nombre"
                                            value={adminForm.data.name}
                                            onChange={e => adminForm.setData("name", e.target.value)}
                                        />

                                        <AdminInput
                                            label="Email"
                                            value={adminForm.data.email}
                                            onChange={e => adminForm.setData("email", e.target.value)}
                                        />

                                        <AdminInput
                                            label="Password"
                                            type="password"
                                            value={adminForm.data.password}
                                            onChange={e => adminForm.setData("password", e.target.value)}
                                        />

                                        <button className="bg-purple-600 px-6 py-3 rounded-xl">
                                            Crear Admin
                                        </button>

                                    </form>

                                    <AdminTable
                                        list={admins_lista}
                                        onDelete={(id) => handleDelete(id, "usuarios")}
                                        onToggle={handleToggle}
                                        currentId={auth.user.id}
                                        isAdminView={true}
                                    />

                                </div>

                            )}

                            {/* TABLAS GENERALES */}

                            {!["admins", "perfil"].includes(view) && (

                                <AdminTable
                                    list={dataMap[view] || []}
                                    onDelete={(id) => handleDelete(id, view)}
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

function StatCard({ title, count, onClick }) {

    return (
        <div
            onClick={onClick}
            className="bg-[#1A1B23] p-8 rounded-3xl cursor-pointer hover:border-purple-500 border border-purple-900/20"
        >
            <h4 className="text-slate-500 text-xs">{title}</h4>
            <div className="text-3xl font-black">{count}</div>
        </div>
    );
}

function AdminInput({ label, type = "text", value, onChange }) {

    return (
        <div className="flex flex-col">

            <label className="text-xs text-slate-500 mb-1">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                className="bg-[#0F1016] border border-purple-900/20 p-3 rounded-xl"
            />

        </div>
    );
}

function AdminTable({ list, onDelete, onToggle, currentId, isAdminView }) {

    return (

        <table className="w-full">

            <thead>
                <tr className="text-left text-slate-500 text-xs">
                    <th className="py-4">Información</th>
                    {isAdminView && <th>Rol</th>}
                    <th className="text-right">Acciones</th>
                </tr>
            </thead>

            <tbody>

                {list.length === 0 && (

                    <tr>
                        <td colSpan="3" className="text-center py-10 text-slate-500">
                            No hay datos
                        </td>
                    </tr>

                )}

                {list.map(item => (

                    <tr key={item.id} className="border-t border-purple-900/10">

                        <td className="py-5">
                            <div className="font-bold">{item.nombre || item.name}</div>
                            <div className="text-xs text-slate-500">
                                {item.email || item.ciudad || item.correo}
                            </div>
                        </td>

                        {isAdminView && (

                            <td>
                                {item.role}
                            </td>

                        )}

                        <td className="text-right space-x-2">

                            {onToggle && item.id !== currentId && (

                                <button
                                    onClick={() => onToggle(item.id)}
                                    className="text-xs bg-purple-600 px-3 py-2 rounded"
                                >
                                    Toggle
                                </button>

                            )}

                            {item.id !== currentId && (

                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="text-xs bg-red-600 px-3 py-2 rounded"
                                >
                                    Borrar
                                </button>

                            )}

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );
}