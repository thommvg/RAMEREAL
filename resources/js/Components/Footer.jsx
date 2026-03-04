import React from "react";

export default function Footer() {
    return (
        <footer className="bg-[#7e22ce] text-white border-t w-full">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">

                    {/* COLUMNA 1: LOGO */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <img 
                            src="img/logorame-Photoroom.png" 
                            alt="Rame Logo" 
                            className="h-20 w-auto object-contain"
                        />
                        <p className="text-sm text-purple-100 font-medium">
                            Preferencia de prensa
                        </p>
                    </div>

                    {/* COLUMNA 2: MÉTODOS DE PAGO */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold mb-4 uppercase tracking-wider text-sm">
                           
                        </h3>
                        {/* Aquí puedes agregar iconos de tarjetas después */}
                    </div>

                    {/* COLUMNA 3: SEGURIDAD */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold mb-4 uppercase tracking-wider text-sm">
                            Seguridad
                        </h3>
                        <ul className="space-y-3 text-purple-100 text-sm">
                            <li className="hover:text-white cursor-pointer transition-colors">Términos de servicio</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Aviso de privacidad</li>
                        </ul>
                    </div>

                    {/* COLUMNA 4: LEGAL */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold mb-4 uppercase tracking-wider text-sm">
                            Legal
                        </h3>
                        <ul className="space-y-3 text-purple-100 text-sm">
                            <li className="hover:text-white cursor-pointer transition-colors">Uso debido de la imagen</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Sobre nosotros</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Derechos reservados</li>
                        </ul>
                    </div>

                </div>
                
                {/* Línea divisoria opcional para un acabado más limpio */}
                <div className="border-t border-purple-500 mt-10 pt-6 text-center text-xs text-purple-300">
                    © {new Date().getFullYear()} Rame. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}