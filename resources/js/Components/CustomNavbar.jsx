// resources/js/Components/CustomNavbar.jsx

import React from 'react';
import { Link } from '@inertiajs/react';

// --- COMPONENTE PARA LINKS DE SCROLL (NO RECARGA) ---
const NavScrollLink = ({ href, children }) => {
    const classes = 'inline-flex items-center px-5 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-gray-300 focus:outline-none focus:text-white transition duration-150 ease-in-out cursor-pointer';

    return (
        <a href={href} className={classes}>
            {children}
        </a>
    );
};

// --- COMPONENTE PARA LINKS NORMALES (CAMBIO DE PÁGINA) ---
const NavLink = ({ href, active, children }) => {
    const classes = active 
        ? 'inline-flex items-center px-5 pt-1 border-b-2 border-white text-sm font-medium leading-5 text-white focus:outline-none focus:border-white transition duration-150 ease-in-out'
        : 'inline-flex items-center px-5 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-gray-300 focus:outline-none focus:text-white transition duration-150 ease-in-out';

    return (
        <Link href={href} className={classes}>
            {children}
        </Link>
    );
};

export default function CustomNavbar({ user }) {
    return (
        <nav className="bg-purple-900 border-b border-purple-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20"> {/* Ajusté a h-20 para que se vea mejor */}
                    {/* Logo */}
                    <div className="flex">
                        <Link href="/" className="flex items-center">
                            <img 
                                src="/img/logorame-Photoroom.png" 
                                alt="Logo" 
                                className="h-12 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Menú de Navegación Principal */}
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {/* El inicio sí puede ser Link para limpiar la URL */}
                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Inicio
                        </NavLink>

                        {/* ESTOS USAN NavScrollLink PARA QUE NO SE BORREN LOS DATOS */}
                        <NavScrollLink href="#Lugares">
                            Lugares
                        </NavScrollLink>

                        <NavScrollLink href="#Restaurantes">
                            Restaurantes
                        </NavScrollLink>

                        <NavScrollLink href="#Contacto">
                            Contáctanos
                        </NavScrollLink>
                    </div>

                    {/* Botón de Cuenta/Registro */}
                    <div className="flex items-center">
                        {user ? (
                            <Link href={route('profile.edit')} className="text-white hover:text-purple-300 font-bold uppercase text-xs tracking-widest">
                                {user.name}
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-white hover:text-purple-300 mr-4 text-sm">
                                    Iniciar Sesión
                                </Link>
                                <Link href={route('register')} className="bg-white text-purple-900 font-bold py-1.5 px-3 rounded-md hover:bg-gray-200 text-sm">
                                    Registro
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}