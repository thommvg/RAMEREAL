import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const addressCache = {};

function crearIcono(color) {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
}

// 🔵🔴 ICONO SEGÚN TIPO (con fallback seguro)
function obtenerIconoPorTipo(tipo) {
    if (tipo === "restaurante") {
        return crearIcono("red");
    }
    return crearIcono("blue"); // todo lo demás azul
}

// ===============================
// GEOCODIFICACIÓN
// ===============================
async function obtenerDireccion(lat, lng) {
    const key = `${lat},${lng}`;
    if (addressCache[key]) return addressCache[key];

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();

        if (data.address) {
            const addr = data.address;
            const road = addr.road || addr.pedestrian || addr.footway || addr.path || "";
            const house = addr.house_number || "";
            const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || "";

            if (road && house) {
                const direccionExacta = `${road} # ${house}${city ? ", " + city : ""}`;
                addressCache[key] = direccionExacta;
                return direccionExacta;
            }
        }
    } catch (e) {}

    const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    addressCache[key] = fallback;
    return fallback;
}

// ===============================
// COMPONENTE MAPA
// ===============================
export default function Mapa({ center = [6.2442, -75.5812], lugares = [] }) {

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayer = useRef(null);
    const markersRef = useRef({});
    const userMarkerRef = useRef(null);

    const [direcciones, setDirecciones] = useState({});

    // Crear mapa
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current).setView(center, 13);
        mapInstance.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        markersLayer.current = L.layerGroup().addTo(map);

        // Ubicación del usuario
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;

                const userMarker = L.marker([latitude, longitude], {
                    icon: crearIcono("green"),
                }).bindPopup("Estás aquí");

                userMarker.addTo(map);
                userMarkerRef.current = userMarker;
            });
        }

    }, []);

    // Obtener direcciones
    useEffect(() => {
        lugares.forEach(async (lugar) => {
            if (lugar.lat && lugar.lng) {
                const lat = parseFloat(lugar.lat);
                const lng = parseFloat(lugar.lng);

                const direccion = await obtenerDireccion(lat, lng);

                setDirecciones(prev => ({
                    ...prev,
                    [lugar.id]: direccion
                }));
            }
        });
    }, [lugares]);

    // Actualizar marcadores
    useEffect(() => {

        if (!mapInstance.current || !markersLayer.current) return;

        const map = mapInstance.current;
        const layer = markersLayer.current;

        layer.clearLayers();
        markersRef.current = {};

        const markers = [];

        lugares.forEach((lugar) => {

            if (lugar.lat && lugar.lng) {

                const lat = parseFloat(lugar.lat);
                const lng = parseFloat(lugar.lng);

                if (!isNaN(lat) && !isNaN(lng)) {

                    const direccionFinal =
                        direcciones[lugar.id] ||
                        lugar.direccion ||
                        "Cargando dirección...";

                    const tipoSeguro = lugar.tipo_entidad || "lugar";

                    const marker = L.marker([lat, lng], {
                        icon: obtenerIconoPorTipo(tipoSeguro)
                    })
                    .bindPopup(`
                        <strong>${lugar.nombre}</strong><br/>
                        ${direccionFinal}<br/>
                        ${lugar.ciudad || ""}
                    `);

                    layer.addLayer(marker);
                    markers.push(marker);
                    markersRef.current[lugar.id] = marker;
                }
            }
        });

        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }

    }, [lugares, direcciones]);

    function centrarLugar(lugar) {
        const marker = markersRef.current[lugar.id];
        if (marker && mapInstance.current) {
            mapInstance.current.setView(marker.getLatLng(), 16);
            marker.openPopup();
        }
    }

    // 🔥 FILTRO SEGURO (NO DESAPARECE NADA)
    const lugaresNormales = lugares.filter(
        l => !l.tipo_entidad || l.tipo_entidad === "lugar"
    );

    const restaurantes = lugares.filter(
        l => l.tipo_entidad === "restaurante"
    );

    console.log("LUGARES QUE LLEGAN:", lugares);

    return (
        <div className="flex gap-4 w-full h-[600px] bg-purple-600 p-1 rounded-xl overflow-hidden">

            {/* SIDEBAR */}
            <div className="w-80 bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden">

                <div className="p-4 border-b font-bold text-lg">
                    📍 Ubicaciones
                </div>

                <div className="flex-1 overflow-y-auto custom-scroll">

                    {lugares.length === 0 && (
                        <div className="p-4 text-gray-500">
                            No hay ubicaciones aún
                        </div>
                    )}

                    {/* LUGARES */}
                    {lugaresNormales.length > 0 && (
                        <>
                            <div className="p-3 font-bold text-blue-600 border-b">
                                📍 Lugares
                            </div>

                            {lugaresNormales.map((lugar) => (
                                <div
                                    key={lugar.id}
                                    onClick={() => centrarLugar(lugar)}
                                    className="p-4 border-b cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="font-semibold">
                                        {lugar.nombre}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {direcciones[lugar.id] || lugar.direccion || "Cargando dirección..."}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {lugar.ciudad}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* RESTAURANTES */}
                    {restaurantes.length > 0 && (
                        <>
                            <div className="p-3 font-bold text-red-600 border-b">
                                🍴 Restaurantes
                            </div>

                            {restaurantes.map((lugar) => (
                                <div
                                    key={lugar.id}
                                    onClick={() => centrarLugar(lugar)}
                                    className="p-4 border-b cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="font-semibold text-red-600">
                                        {lugar.nombre}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {direcciones[lugar.id] || lugar.direccion || "Cargando dirección..."}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {lugar.ciudad}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                </div>
            </div>

            {/* MAPA */}
            <div className="flex-1 rounded-xl overflow-hidden shadow-lg">
                <div ref={mapRef} className="w-full h-full"></div>
            </div>

        </div>
    );
}