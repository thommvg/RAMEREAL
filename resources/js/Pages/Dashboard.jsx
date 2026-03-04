import Footer from "@/Components/Footer";
import "leaflet/dist/leaflet.css";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Mapa from "@/Components/Mapa";

// --- 1. COMPONENTE HERO ---
function HeroHeader() {
    return (
        <div className="relative bg-gray-900 overflow-hidden" id='Inicio'>
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{
                    backgroundImage: "url('https://www.medellincomovamos.org/wp-content/uploads/2025/09/2-El-desastre-no-es-natural.jpg')",
                    backgroundColor: '#1e0a35'
                }}
            ></div>
            <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32 flex items-center h-96">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-extrabold text-purple-200 sm:text-4xl italic">
                        Descubre hermosos lugares del valle de aburra
                    </h2>
                    <p className="mt-4 text-lg text-purple-300">
                        Encuentra las joyas escondidas y los restaurantes mejor valorados
                    </p>
                    <Link 
                        href={route('explorar')} 
                        className="mt-6 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition shadow-lg">
                        Explorar más lugares
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- 2. COMPONENTE TARJETA CIRCULAR ---
const PlaceCard = ({ name, rating, imageUrl }) => {
    const numericRating = Math.round(rating || 0);
    const stars = Array(5).fill(0).map((_, index) => (
        <span key={index} className={`text-2xl ${index < numericRating ? 'text-purple-500' : 'text-gray-600'}`}>★</span>
    ));

    return (
        <div className="flex flex-col items-center p-4 hover:scale-105 transition duration-300 group">
            <div className="relative w-40 h-40">
                <img
                    src={imageUrl || "https://placehold.co/150x150"}
                    alt={name}
                    className="w-full h-full object-cover rounded-full shadow-lg border-4 border-purple-500 group-hover:border-white transition"
                />
            </div>
            <p className="mt-4 text-white text-center font-semibold uppercase text-sm tracking-wider">{name}</p>
            <div className="flex mt-2">{stars}</div>
        </div>
    );
};

// --- 3. DASHBOARD PRINCIPAL ---
export default function Dashboard({ auth, lugares, restaurantes, lugaresMapa }) {
    const { flash } = usePage().props; 
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal Registro
    const [selectedItem, setSelectedItem] = useState(null); // Modal Detalle
    const [itemType, setItemType] = useState(''); // 'lugar' o 'restaurante'
    const [showToast, setShowToast] = useState(false); 

    useEffect(() => {
        if (flash.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    // FORMULARIO PARA REGISTRO DE NUEVOS LUGARES
    const { 
        data: lugarData, setData: setLugarData, post: postLugar, 
        processing: processingLugar, reset: resetLugar, errors: errorsLugar 
    } = useForm({
        tipo_entidad: 'lugar', nombre: '', direccion: '', ciudad: '', 
        comentario: '', puntuacion: 5, imagen: '', tipo_de_turismo_id: '', 
    });

    // FORMULARIO PARA VALORACIONES (DETALLE)
    const { 
        data: reviewData, setData: setReviewData, post: postReview, 
        processing: procReview, reset: resetReview, errors: errorsReview 
    } = useForm({
        puntuacion: 5, comentario: '', entidad_id: '', tipo: ''
    });

    // FORMULARIO DE CONTACTO
    const { 
        data: contactoData, setData: setContactoData, post: postContacto, 
        processing: procCont, reset: resetCont, errors: errorsCont 
    } = useForm({
        nombre: '', telefono: '', correo: '', mensaje: ''
    });

    const handleLugarSubmit = (e) => {
        e.preventDefault();
        postLugar(route('dashboard.store'), {
            preserveScroll: true,
            onSuccess: () => { setIsModalOpen(false); resetLugar(); }
        });
    };

    const openDetails = (item, type) => {
        setSelectedItem(item);
        setItemType(type);
        setReviewData({ 
            ...reviewData, 
            entidad_id: item.id, 
            tipo: type,
            comentario: '',
            puntuacion: 5 
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Inicio" />

            {/* TOAST DE ÉXITO */}
            {showToast && (
                <div className="fixed top-24 right-5 z-[120] animate-in fade-in slide-in-from-right-10 duration-500">
                    <div className="bg-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-purple-400 flex items-center space-x-3">
                        <span className="text-2xl">✨</span>
                        <div>
                            <p className="font-black uppercase tracking-tighter text-xs">Sistema Rame</p>
                            <p className="text-sm font-medium">{flash.success}</p>
                        </div>
                    </div>
                </div>
            )}

            <HeroHeader />

            {/* SECCIÓN LUGARES */}
            <div className="bg-gray-900 py-12 border-t border-purple-800" id="Lugares">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-3xl font-extrabold text-white text-center mb-10 italic uppercase tracking-widest">Lugares mejor puntuados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {lugares?.map((l) => (
                            <div key={l.id} onClick={() => openDetails(l, 'lugar')} className="cursor-pointer">
                                <PlaceCard name={l.nombre} rating={l.valoraciones_avg_puntuacion} imageUrl={l.imagen} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECCIÓN RESTAURANTES */}
            <div className="bg-gray-900 py-20 border-t border-purple-800" id="Restaurantes">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-3xl font-extrabold text-white text-center mb-10 italic uppercase tracking-widest">Restaurantes más buscados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {restaurantes?.map((r) => (
                            <div key={r.id} onClick={() => openDetails(r, 'restaurante')} className="cursor-pointer">
                                <PlaceCard name={r.nombre} rating={r.valoraciones_avg_puntuacion} imageUrl={r.imagen} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECCIÓN: MAPA */}
                <div className="bg-gray-900 py-16 border-t border-purple-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Título */}
                <h3 className="text-3xl font-extrabold text-white text-center mb-10">
                    Ubicación de los lugares
                </h3>

            {/* Contenedor del mapa */}
                    <div className="relative z-0 w-full h-[500px] rounded-xl overflow-hidden shadow-2xl border-4 border-purple-700">
                        <Mapa lugares={lugaresMapa} />
                    </div>

            </div>
        </div>

            {/* SECCIÓN CONTACTO */}
            <div className="bg-gray-900 py-16 border-t border-purple-800">
                <div className="max-w-4xl mx-auto px-4">
                    <h3 className="text-3xl font-extrabold text-white text-center mb-10 uppercase italic tracking-tighter">Contacto</h3>
                    <form onSubmit={(e) => { e.preventDefault(); postContacto(route('contactos.store'), { onSuccess: () => resetCont() }); }} className="p-4 md:p-10 bg-gray-800/30 rounded-3xl border border-purple-500/20 shadow-inner">
                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className="flex flex-col">
                                <input type="text" placeholder="Nombre" value={contactoData.nombre} onChange={e => setContactoData('nombre', e.target.value)} className={`w-full p-3 rounded-xl bg-white text-black ${errorsCont.nombre ? 'ring-2 ring-red-500' : ''}`} />
                                {errorsCont.nombre && <span className="text-red-500 text-xs mt-1">{errorsCont.nombre}</span>}
                            </div>
                            <div className="flex flex-col">
                                <input type="text" placeholder="Teléfono" value={contactoData.telefono} onChange={e => setContactoData('telefono', e.target.value)} className={`w-full p-3 rounded-xl bg-white text-black ${errorsCont.telefono ? 'ring-2 ring-red-500' : ''}`} />
                                {errorsCont.telefono && <span className="text-red-500 text-xs mt-1">{errorsCont.telefono}</span>}
                            </div>
                            <div className="flex flex-col">
                                <input type="email" placeholder="Correo" value={contactoData.correo} onChange={e => setContactoData('correo', e.target.value)} className={`w-full p-3 rounded-xl bg-white text-black ${errorsCont.correo ? 'ring-2 ring-red-500' : ''}`} />
                                {errorsCont.correo && <span className="text-red-500 text-xs mt-1">{errorsCont.correo}</span>}
                            </div>
                        </div>
                        <textarea placeholder="Mensaje" value={contactoData.mensaje} onChange={e => setContactoData('mensaje', e.target.value)} className={`w-full p-3 rounded-xl bg-white text-black mb-1 h-32 ${errorsCont.mensaje ? 'ring-2 ring-red-500' : ''}`}></textarea>
                        {errorsCont.mensaje && <span className="text-red-500 text-xs block mb-4">{errorsCont.mensaje}</span>}
                        <div className="text-center">
                            <button type="submit" disabled={procCont} className="px-12 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow-lg font-black uppercase tracking-widest">Enviar Mensaje</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL DETALLE CON COMENTARIOS Y VALIDACIÓN */}
            {selectedItem && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
                    <div className="bg-gray-900 border border-purple-500/50 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]">
                        <div className="md:w-1/2 h-72 md:h-auto overflow-hidden relative">
                            <img src={selectedItem.imagen} alt={selectedItem.nombre} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 p-6">
                                <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase">
                                    {itemType === 'lugar' ? 'Destino' : 'Restaurante'}
                                </span>
                            </div>
                        </div>

                        <div className="md:w-1/2 p-10 text-white overflow-y-auto relative flex flex-col">
                            <button onClick={() => { setSelectedItem(null); resetReview(); }} className="absolute top-5 right-7 text-4xl text-gray-500 hover:text-white transition">&times;</button>
                            <div className="mb-6">
                                <h2 className="text-4xl font-black italic uppercase text-purple-400 mb-2">{selectedItem.nombre}</h2>
                                <div className="flex items-center space-x-2 text-yellow-400 mb-4">
                                    <span className="text-xl font-bold">{Number(selectedItem.valoraciones_avg_puntuacion || 0).toFixed(1)}</span>
                                    <span className="text-lg">★</span>
                                    <span className="text-gray-400 text-xs uppercase font-bold tracking-widest ml-2">Calificación Actual</span>
                                </div>
                                <div className="space-y-2 text-gray-300 bg-gray-800/20 p-4 rounded-2xl">
                                    <p className="text-sm"><strong>📍 Dirección:</strong> {selectedItem.direccion}</p>
                                    <p className="text-sm"><strong>🏙️ Ciudad:</strong> {selectedItem.ciudad}</p>
                                    <p className="text-sm italic mt-2 text-gray-400">"{selectedItem.comentario || 'Sin descripción adicional'}"</p>
                                </div>
                            </div>

                            <div className="mt-auto border-t border-purple-900/50 pt-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Escribe tu reseña</h4>
                                <form onSubmit={(e) => { 
                                    e.preventDefault(); 
                                    postReview(route('valoraciones.store'), { 
                                        onSuccess: () => { resetReview(); setSelectedItem(null); },
                                        preserveScroll: true
                                    }); 
                                }} className="space-y-4">
                                    <select value={reviewData.puntuacion} onChange={e => setReviewData('puntuacion', e.target.value)} className="w-full bg-gray-800 border-none rounded-xl text-white p-3">
                                        <option value="5">⭐⭐⭐⭐⭐ (Excelente)</option>
                                        <option value="4">⭐⭐⭐⭐ (Muy Bueno)</option>
                                        <option value="3">⭐⭐⭐ (Bueno)</option>
                                        <option value="2">⭐⭐ (Regular)</option>
                                        <option value="1">⭐ (No recomendado)</option>
                                    </select>
                                    <div>
                                        <textarea placeholder="¿Cómo fue tu experiencia? (mínimo 10 caracteres)..." value={reviewData.comentario} onChange={e => setReviewData('comentario', e.target.value)} 
                                            className={`w-full bg-gray-800 border-none rounded-xl text-white h-32 p-4 text-sm focus:ring-2 ${errorsReview.comentario ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'}`}></textarea>
                                        {errorsReview.comentario && <p className="text-red-500 text-xs mt-2 font-medium">{errorsReview.comentario}</p>}
                                    </div>
                                    <button type="submit" disabled={procReview} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl uppercase transition shadow-lg active:scale-95">
                                        {procReview ? 'SUBIENDO...' : 'PUBLICAR COMENTARIO'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BOTÓN FLOTANTE (+) */}
            <button
                onClick={() => { resetLugar(); setIsModalOpen(true); }}
                className="fixed bottom-10 left-10 w-16 h-16 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center text-4xl z-50 transition border-2 border-purple-400 font-black hover:rotate-90 duration-300"
            > + </button>

            {/* MODAL NUEVO REGISTRO COMPLETO CON VALIDACIONES */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-gray-900 border border-purple-500/30 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 text-white">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Nuevo Registro</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                        </div>

                        <form onSubmit={handleLugarSubmit} noValidate className="space-y-4 text-white">
                            <div className="flex bg-gray-800 p-1 rounded-xl mb-2">
                                <button type="button" onClick={() => setLugarData('tipo_entidad', 'lugar')} className={`flex-1 py-2 rounded-lg font-bold transition ${lugarData.tipo_entidad === 'lugar' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>📍 Lugar</button>
                                <button type="button" onClick={() => setLugarData('tipo_entidad', 'restaurante')} className={`flex-1 py-2 rounded-lg font-bold transition ${lugarData.tipo_entidad === 'restaurante' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>🍴 Restaurante</button>
                            </div>

                            <div>
                                <input type="text" placeholder="Nombre" value={lugarData.nombre} onChange={e => setLugarData('nombre', e.target.value)} className={`w-full bg-gray-800 border-none rounded-xl text-white p-3 ${errorsLugar.nombre ? 'ring-2 ring-red-500' : ''}`} />
                                {errorsLugar.nombre && <span className="text-red-500 text-xs mt-1 block">{errorsLugar.nombre}</span>}
                            </div>
                            
                            <div>
                                <input type="text" placeholder="Dirección" value={lugarData.direccion} onChange={e => setLugarData('direccion', e.target.value)} className={`w-full bg-gray-800 border-none rounded-xl text-white p-3 ${errorsLugar.direccion ? 'ring-2 ring-red-500' : ''}`} />
                                {errorsLugar.direccion && <span className="text-red-500 text-xs mt-1 block">{errorsLugar.direccion}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <select value={lugarData.ciudad} onChange={e => setLugarData('ciudad', e.target.value)} className={`w-full bg-gray-800 border-none rounded-xl text-white p-3 ${errorsLugar.ciudad ? 'ring-2 ring-red-500' : ''}`}>
                                        <option value="">Municipio</option>
                                        <option value="Medellín">Medellín</option><option value="Envigado">Envigado</option>
                                        <option value="Itagüí">Itagüí</option><option value="Sabaneta">Sabaneta</option><option value="Bello">Bello</option>
                                    </select>
                                    {errorsLugar.ciudad && <span className="text-red-500 text-xs mt-1 block">{errorsLugar.ciudad}</span>}
                                </div>
                                <select value={lugarData.tipo_de_turismo_id} onChange={e => setLugarData('tipo_de_turismo_id', e.target.value)} className="w-full bg-gray-800 border-none rounded-xl text-white p-3">
                                    <option value="">Categoría</option>
                                    {lugarData.tipo_entidad === 'lugar' ? (
                                        <><option value="2">Naturaleza</option><option value="3">Cultura</option></>
                                    ) : (
                                        <><option value="1">Típica</option><option value="2">Internacional</option></>
                                    )}
                                </select>
                            </div>

                            <div className="p-4 bg-gray-800/50 rounded-2xl border border-purple-500/20 text-center">
                                <label className="block text-[10px] font-bold text-purple-400 mb-2 uppercase">Calificación inicial</label>
                                <select value={lugarData.puntuacion} onChange={e => setLugarData('puntuacion', e.target.value)} className="w-full bg-gray-700 border-none rounded-lg text-white mb-3 p-3">
                                    <option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option>
                                </select>
                                <textarea placeholder="Descripción del lugar..." value={lugarData.comentario} onChange={e => setLugarData('comentario', e.target.value)} className={`w-full bg-gray-700 border-none rounded-xl text-white text-sm h-20 p-3 ${errorsLugar.comentario ? 'ring-2 ring-red-500' : ''}`}></textarea>
                                {errorsLugar.comentario && <span className="text-red-500 text-xs mt-1 block">{errorsLugar.comentario}</span>}
                            </div>

                            <div>
                                <input type="text" placeholder="URL de la Imagen" value={lugarData.imagen} onChange={e => setLugarData('imagen', e.target.value)} className={`w-full bg-gray-800 border-none rounded-xl text-white text-sm p-3 ${errorsLugar.imagen ? 'ring-2 ring-red-500' : ''}`} />
                                {errorsLugar.imagen && <span className="text-red-500 text-xs mt-1 block">{errorsLugar.imagen}</span>}
                            </div>

                            <button type="submit" disabled={processingLugar} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 uppercase">
                                {processingLugar ? 'Guardando...' : 'Registrar en RAME'}
                            </button>
                        </form>
                    </div>
                </div> 
            )}
        <Footer />
        </AuthenticatedLayout>
    );
}