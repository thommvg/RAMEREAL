import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // La función handleImageError se mantiene, aunque hemos simplificado el fondo.
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Rame" />
            
            {/* Contenedor principal: color de fondo muy claro */}
            <div className="bg-purple-300 min-h-screen flex items-center justify-center">
                {/* Contenedor de la vista (simula el centro de la pantalla) */}
                <div className="w-full max-w-7xl mx-auto px-6 py-20">
                    <div className="flex flex-col lg:flex-row lg:justify-between items-center">
                        
                        {/* COLUMNA IZQUIERDA: Logo y mensaje */}
                        <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
                            <h1 className="text-8xl font-bold text-black mb-6">
                                RAME
                            </h1>
                            <p className="text-4xl text-black font-bold mb-10">
                                Conoce lugares increibles atraves del Valle de aburra.
                            </p>
                        </div>

                        <div className="w-full max-w-sm">
                            <div className="bg-white p-6 rounded-lg shadow-lg">

                                <Link
                                    href={route('login')}
                                    className="w-full block text-center bg-purple-600 text-white py-3 rounded-md font-bold text-xl hover:bg-purple-900 transition"
                                >
                                    Iniciar sesión
                                </Link>

                                <hr className="my-4" />

                                <Link
                                    href={route('register')}
                                    className="block w-4/5 mx-auto text-center bg-purple-900 text-white py-3 rounded-md font-bold text-lg hover:bg-purple-600 transition"
                                >
                                    Crear cuenta nueva
                                </Link>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}