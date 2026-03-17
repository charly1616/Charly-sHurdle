import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Footer from '../components/Footer';
import FourierSignature from '../components/FourierSignature';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { FriendId } = location.state || {};
    const [friend, setFriend] = useState(null);

    useEffect(() => {

        if (FriendId) {
            fetch(`https://charlyshurdlebackend-tau.vercel.app/api/Friends/${FriendId}`)
                .then(response => response.json())
                .then(data => {
                    if (!data.isFinished) {
                        navigate("/", {replace:true});
                        return
                    }
                    setFriend(data);
                })
                .then(()=>{
                    if (data.isFinished) confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#4db69e', '#3b5998', '#ffab6d']
                    });
                })
                .catch(error => console.error('Error fetching friend data:', error));
        }

        

    }, [FriendId]);

    if (!friend) return <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center italic text-gray-400">Generando certificado...</div>;

    const baseColor = friend.Color || "#3b5998";

    return (
        <div className="min-h-screen bg-[#F8FAFB] flex flex-col font-sans relative overflow-x-hidden">

            {/* FONDO DE ICONOS REPETIDOS (CHECKBOARD) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                <div className="grid grid-cols-4 md:grid-cols-10 gap-x-12 gap-y-16 p-10">
                    {[...Array(100)].map((_, i) => {
                        // Definimos el número de columnas según el breakpoint (4 en móvil, 10 en md)
                        // Esto es para calcular qué fila estamos renderizando
                        const cols = 10; 
                        const row = Math.floor(i / cols);
                        const isShifted = row % 2 === 0; // Alterna el desplazamiento por fila

                        return (
                            <div 
                                key={i} 
                                className={`flex justify-center items-center transition-transform duration-1000
                                    ${isShifted ? 'translate-x-10' : '-translate-x-10'}`}
                            >
                                <i className={`${friend.Icon} text-5xl transform 
                                    ${i % 2 === 0 ? 'rotate-12' : '-rotate-12'}`}>
                                </i>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CONTENIDO */}
            <div className="relative z-10 flex-1 flex flex-col items-center py-12 px-4">

                {/* TEXTO SUPERIOR */}
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-black text-gray-800 mb-2 agu-display">¡Felicitaciones!</h1>
                    <p className="text-gray-500">Tu memoria e inteligencia es de otro planeta. Aquí tienes tu premio:</p>
                    <p className='text-sm text-gray-200'>Guardalo y muestraselo a charly/jose que te puede servir para algo</p>
                </div>

                {/* TARJETA DEL CERTIFICADO */}
                <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-4md overflow-hidden border border-gray-100 flex flex-col">

                    {/* CABECERA (Header con Icono Central) */}
                    <div
                        className="relative h-32 flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: baseColor }}
                    >
                        {/* Líneas horizontales blancas */}
                        <div className="absolute top-1/2 left-10 w-[30%] h-[2px] bg-white/60 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 right-10 w-[30%] h-[2px] bg-white/60 -translate-y-1/2"></div>

                        {/* Icono Central */}
                        <div className="relative z-20 bg-transparent p-2 rounded-full ">
                            <div
                                className="w-28 h-28 rounded-full flex items-center subtleShadow justify-center text-white text-5xl "
                                style={{ backgroundColor: baseColor, translate: "0 5%" }}
                            >
                                <i className={friend.Icon}></i>
                            </div>
                        </div>

                        {/* Ondulación/Curva inferior suave */}
                        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{outline: '1px solid white', outlineOffset: "-1px"}}>
                            <path 
                            fill="#ffffff" 
                            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,53.3C672,43,768,21,864,21.3C960,21,1056,43,1152,53.3C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z">
                            </path>
                        </svg>
                    </div>

                    {/* CUERPO (Texto centrado) */}
                    <div className="pt-6 pb-12 px-8 text-center bg-white">

                        <p className="text-gray-400 uppercase tracking-[0.2em] text-sm font-bold mb-4" style={{ fontFamily: 'serif' }}>
                            Certificado de Amistad
                        </p>

                        <h2 className="text-7xl text-gray-800 mb-2" style={{ fontFamily: '"Dancing Script", cursive' }}>
                            {friend.FullName}
                        </h2>

                        <p className="text-gray-600 italic text-xl mb-6">
                            "{friend.SuccessText || "Una persona muy significativa"}"
                        </p>


                        <div className="flex flex-row justify-between">

                            {/* Tags en formato horizontal separado por barras */}
                            <div className="flex flex-wrap justify-center items-end gap-3 text-gray-300 font-medium mb-4 border-t border-gray-50 pt-6">
                                {friend.tags && friend.tags.map((tag, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="text-gray-400 hover:text-gray-600 transition-colors uppercase text-xs tracking-widest ">
                                            {tag.trim()}
                                        </span>
                                        {idx < friend.tags.length - 1 && <span className="text-gray-200">|</span>}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* SECCIÓN DE FIRMA */}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <FourierSignature
                                        width={220}
                                        height={80}
                                        showEpicycles={true}
                                    />
                                    <div className="absolute bottom-4 left-0 right-0 h-[1px] bg-gray-200"></div>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                    Firma Digital de CharlyPus
                                </p>
                            </div>

                        </div>


                    </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="mt-10 flex gap-4">
                    <button
                        onClick={(e) => {e.preventDefault();e.stopPropagation(); navigate('/',{replace:true})}}
                        className="bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 px-8 py-3 rounded-full font-bold shadow-sm transition-all active:scale-95"
                    >
                        Volver
                    </button>
                    <button
                        onClick={(e) => {e.preventDefault(); window.print()}}
                        className="bg-[#4db69e] hover:bg-[#3d9682] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-100 transition-all active:scale-95"
                    >
                        Guardar Certificado
                    </button>
                </div>
            </div>

            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                
                @media print {
                    button, footer { display: none !important; }
                    body { background: white; }
                    .min-h-screen { min-height: 0; padding: 0; }
                }
            `}</style>
        </div>
    );
};

export default SuccessPage;