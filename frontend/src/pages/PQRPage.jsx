import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'; // Notificaciones bonitas
import Footer from '../components/Footer';

const PQRPage = () => {
    const [suggestion, setSuggestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (suggestion.trim().length < 10) {
            toast.error("Por favor, escribe un poco más (mínimo 10 caracteres).");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://charlyshurdlebackend-tau.vercel.app/api/suggestions/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: suggestion })
            });

            if (response.ok) {
                toast.success('¡Sugerencia enviada con éxito! Gracias por ayudarnos a mejorar.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        borderRadius: '1rem',
                        background: '#333',
                        color: '#fff',
                    },
                });
                setSuggestion(""); // Limpiar el campo
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error("Hubo un problema al enviar. Inténtalo más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFB] flex flex-col font-sans">
            {/* Componente para mostrar los Toasts */}
            <Toaster />

            {/* HEADER / NAV */}
            <nav className="p-6 max-w-7xl mx-auto w-full flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => {e.preventDefault();e.stopPropagation(); navigate('/',{replace:true})}}>
                    <img src="/CharlypusDark.svg" alt="Logo" className="w-8 h-8" />
                    <span className="text-xl font-bold text-gray-800 agu-display">Charly's Hurdle</span>
                </div>
                <button 
                    onClick={(e) => {e.preventDefault();e.stopPropagation(); navigate('/',{replace:true})}}
                    className="text-gray-500 hover:text-[#4db69e] font-semibold transition-colors flex items-center gap-2"
                >
                    <i className="fas fa-arrow-left"></i> Volver al inicio
                </button>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 transition-all">
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#4db69e]/10 text-[#4db69e] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                            <i className="fas fa-envelope-open-text"></i>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">PQR & Sugerencias</h2>
                        <p className="text-gray-500">¿Tienes alguna duda o idea para mejorar el banquete? ¡Escríbenos!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <textarea
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                                placeholder="Escribe aquí tu petición, queja o sugerencia..."
                                className="w-full min-h-[200px] p-6 rounded-3xl border-2 border-gray-100 focus:border-[#4db69e] focus:ring-4 focus:ring-[#4db69e]/5 outline-none text-gray-700 text-lg transition-all resize-none shadow-sm"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                type="button"
                                onClick={(e) => {e.preventDefault();e.stopPropagation(); navigate('/',{replace:true})}}
                                className="order-2 md:order-1 flex-1 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`order-1 md:order-2 flex-[2] bg-[#4db69e] text-white py-4 rounded-2xl font-black text-xl shadow-lg shadow-[#4db69e]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                                ) : (
                                    <>Enviar ahora <i className="fas fa-paper-plane text-sm"></i></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PQRPage;