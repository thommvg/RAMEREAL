import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';

export default function Explorar({ auth, resultados = [], filtros = {} }) {
    const { flash } = usePage().props;
    const [selectedItem, setSelectedItem] = useState(null);
    const [showToast, setShowToast] = useState(false);

    // Estado de los filtros
    const [values, setValues] = useState({
        search: filtros.search || '',
        city: filtros.city || '',
        stars: filtros.stars || '',
    });

    // Formulario para nuevas reseñas
    const { 
        data: reviewData, setData: setReviewData, post: postReview, 
        processing: procReview, reset: resetReview, errors: errorsReview 
    } = useForm({
        puntuacion: 5, comentario: '', entidad_id: '', tipo: ''
    });

    // Envío automático al cambiar filtros (Debounce de 300ms)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route('explorar'), values, { 
                preserveState: true, 
                preserveScroll: true,
                replace: true 
            });
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [values]);

    useEffect(() => {
        if (flash.success) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        }
    }, [flash.success]);

    const openDetails = (item) => {
        setSelectedItem(item);
        setReviewData({
            ...reviewData,
            entidad_id: item.id,
            tipo: item.tipo.toLowerCase(),
            comentario: '',
            puntuacion: 5
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Explorar - Rame" />

            <style>{`
                .comment-scroll::-webkit-scrollbar { width: 4px; }
                .comment-scroll::-webkit-scrollbar-track { background: transparent; }
                .comment-scroll::-webkit-scrollbar-thumb { background: #9333ea; border-radius: 10px; }
            `}</style>

            {showToast && (
                <div className="fixed top-10 right-10 z-[150] bg-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold border border-purple-400">
                    ✨ {flash.success}
                </div>
            )}

            <div className="py-12 bg-gray-900 min-h-screen text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* ENCABEZADO */}
                    <div className="mb-10 border-b border-white/10 pb-6 flex justify-between items-end">
                        <div>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter">
                                Explorar <span className="text-purple-600 drop-shadow-[0_0_8px_rgba(147,51,234,0.4)]">Rame</span>
                            </h2>
                            <p className="text-gray-400 mt-2 italic">Descubre tesoros en el Valle de Aburrá</p>
                        </div>
                        <button 
                            onClick={() => setValues({search: '', city: '', stars: ''})}
                            className="text-[10px] font-bold text-gray-500 hover:text-purple-400 uppercase tracking-widest transition"
                        >
                            Limpiar filtros
                        </button>
                    </div>

                    {/* BARRA DE BÚSQUEDA */}
                    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] shadow-2xl mb-12 border border-white/5 backdrop-blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input
                                type="text"
                                placeholder="🔍 Buscar por nombre..."
                                className="w-full bg-gray-900 border-none text-white rounded-2xl focus:ring-2 focus:ring-purple-600 p-4"
                                value={values.search}
                                onChange={(e) => setValues(prev => ({...prev, search: e.target.value}))}
                            />
                            <select 
                                className="bg-gray-900 border-none text-white rounded-2xl focus:ring-2 focus:ring-purple-600 p-4"
                                value={values.city}
                                onChange={(e) => setValues(prev => ({...prev, city: e.target.value}))}
                            >
                                <option value="">📍 Todas las ciudades</option>
                                <option value="Medellín">Medellín</option>
                                <option value="Bello">Bello</option>
                                <option value="Itagüí">Itagüí</option>
                                <option value="Envigado">Envigado</option>
                                <option value="Sabaneta">Sabaneta</option>
                            </select>
                            <select 
                                className="bg-gray-900 border-none text-white rounded-2xl focus:ring-2 focus:ring-purple-600 p-4"
                                value={values.stars}
                                onChange={(e) => setValues(prev => ({...prev, stars: e.target.value}))}
                            >
                                <option value="">⭐ Calificación (Todas)</option>
                                <option value="5">⭐⭐⭐⭐⭐ Solo 5 Estrellas</option>
                                <option value="4">⭐⭐⭐⭐ Rango 4.0 - 4.9</option>
                                <option value="3">⭐⭐⭐ Rango 3.0 - 3.9</option>
                                <option value="2">⭐⭐ Rango 2.0 - 2.9</option>
                                <option value="1">⭐ Rango 1.0 - 1.9</option>
                            </select>
                        </div>
                    </div>

                    {/* LISTADO DE TARJETAS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {resultados.length > 0 ? (
                            resultados.map((item) => (
                                <div 
                                    key={`${item.tipo}-${item.id}`} 
                                    onClick={() => openDetails(item)}
                                    className="bg-gray-800/30 rounded-[3rem] overflow-hidden shadow-xl hover:shadow-purple-500/20 transition-all duration-500 border border-white/5 cursor-pointer group hover:-translate-y-2"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                        <div className="absolute top-5 right-5 bg-purple-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                            {item.tipo}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-2xl font-black italic uppercase leading-none">{item.nombre}</h3>
                                            <span className="text-yellow-500 font-bold text-sm">★ {Number(item.puntuacion_final).toFixed(1)}</span>
                                        </div>
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                                            <span className="text-purple-500 mr-2">📍</span> {item.ciudad}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5">
                                <p className="text-gray-500 uppercase font-black tracking-[0.3em]">No hay resultados para este filtro</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL MAESTRO */}
            {selectedItem && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
                    <div className="bg-gray-900 border border-white/10 w-full max-w-6xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh]">
                        
                        <div className="md:w-1/2 h-48 md:h-auto relative">
                            <img src={selectedItem.imagen} className="w-full h-full object-cover" />
                        </div>

                        <div className="md:w-1/2 p-10 text-white overflow-y-auto relative flex flex-col bg-gray-900">
                            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-8 text-4xl text-gray-600 hover:text-white">&times;</button>
                            
                            <h2 className="text-4xl font-black italic uppercase text-white mb-1 leading-none">{selectedItem.nombre}</h2>
                            <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest mb-6 border-l-2 border-purple-500 pl-3">
                                {selectedItem.direccion}, {selectedItem.ciudad}
                            </p>

                            {/* DESCRIPCIÓN RE-INTEGRADA */}
                            <div className="mb-8 p-6 bg-white/5 rounded-[2rem] border border-white/5 shadow-inner relative">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-2 italic">Información</h4>
                                <p className="text-gray-300 text-sm leading-relaxed italic">
                                    "{selectedItem.comentario || "Vive una experiencia única en este sitio seleccionado por la comunidad RAME."}"
                                </p>
                            </div>

                            {/* FEED DE COMENTARIOS */}
                            <div className="flex-1 mb-8 flex flex-col">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 border-b border-white/5 pb-2">Reseñas de exploradores</h4>
                                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-3 comment-scroll">
                                    {selectedItem.valoraciones && selectedItem.valoraciones.length > 0 ? (
                                        selectedItem.valoraciones.map((rev, idx) => (
                                            <div key={idx} className="bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 transition">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[11px] font-bold text-purple-400 italic">@{rev.user?.name || 'Explorador'}</span>
                                                    <span className="text-yellow-500 text-[10px]">{'★'.repeat(rev.puntuacion)}</span>
                                                </div>
                                                <p className="text-gray-400 text-xs italic font-medium leading-snug">"{rev.comentario}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 opacity-30 italic text-xs uppercase tracking-widest">Sin reseñas aún</div>
                                    )}
                                </div>
                            </div>

                            {/* INPUT DE RESEÑA COMPACTO */}
                            <div className="mt-auto bg-purple-600/5 p-5 rounded-[2.2rem] border border-purple-500/20 shadow-xl">
                                <form onSubmit={(e) => { 
                                    e.preventDefault(); 
                                    postReview(route('valoraciones.store'), { 
                                        onSuccess: () => { resetReview(); setSelectedItem(null); },
                                        preserveScroll: true
                                    }); 
                                }}>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <select value={reviewData.puntuacion} onChange={e => setReviewData('puntuacion', e.target.value)} className="bg-gray-800 border-none rounded-xl text-white text-xs p-3 sm:w-1/4 cursor-pointer">
                                            {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} ★</option>)}
                                        </select>
                                        <input 
                                            type="text"
                                            placeholder="¿Qué te pareció este sitio?" 
                                            value={reviewData.comentario} 
                                            onChange={e => setReviewData('comentario', e.target.value)} 
                                            className="flex-1 bg-gray-900 border-none rounded-xl text-white p-3 text-xs focus:ring-1 focus:ring-purple-600"
                                        />
                                        <button type="submit" disabled={procReview} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 text-white font-black rounded-xl uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg">
                                            {procReview ? '...' : 'Enviar'}
                                        </button>
                                    </div>
                                    {errorsReview.comentario && <p className="text-red-500 text-[9px] mt-2 ml-2 uppercase font-bold">{errorsReview.comentario}</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}