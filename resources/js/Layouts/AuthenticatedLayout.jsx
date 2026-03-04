// resources/js/Layouts/AuthenticatedLayout.jsx

import React from 'react';
import { usePage } from '@inertiajs/react';
// Importa tu nuevo componente
import CustomNavbar from '@/Components/CustomNavbar'; 

export default function AuthenticatedLayout({ header, children }) {
    // Obtiene el objeto de usuario de Inertia props
    const user = usePage().props.auth.user;
    
    return (
        <div className="min-h-screen bg-gray-100">
            {/* 👈 INSERCIÓN DEL NUEVO NAVBAR MORADO */}
            <CustomNavbar user={user} />

            {/* Encabezado de página (opcional) */}
            {header && (
                <header className="bg-withe shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Contenido principal de la página */}
            <main>{children}</main>
        </div>
    );
}