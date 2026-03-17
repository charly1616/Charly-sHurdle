import React from 'react';
import Footer from '../components/Footer';
import FriendCard from '../components/FriendCard';
import { useEffect, useState } from 'react';

const HomePage = () => {

    const [Friends, setFriends] = useState([]);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

    const moveButton = () => {
        const randomTop = (Math.random()) * 200 - 100; // Random between -100 and 100
        const randomLeft = (Math.random()) * 200 - 100;
        setButtonPosition({ top: randomTop, left: randomLeft });
    };

    useEffect(() => {
        fetch('http://localhost:5000/api/friends')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                const shuffledFriends = [...data].sort(() => Math.random() - 0.5);
                setFriends(shuffledFriends);
            })
            .catch(error => {
                console.error('Error fetching friends:', error);
            });
    }, []);

    return (

        <div className="min-h-screen bg-[#F8FAFB] flex flex-col overflow-hidden gap-2">

            {/* SECCIÓN SUPERIOR: HERO */}
            <section className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl mx-auto px-6 py-6 w-full">

                {/* COLUMNA TEXTO: Usamos flex-1 para que ocupe la mitad exacta */}
                <div className='flex-1 flex flex-col items-center md:items-start text-center md:text-left'>

                    <h2 className='text-5xl md:text-6xl font-black text-gray-800 mb-6 leading-tight agu-display'>
                        Charly's Hurdle
                    </h2>

                    {/* IMPORTANTE: Quitamos w-max y usamos max-w-md para que el texto sea un bloque centrado */}
                    <p className='text-lg text-gray-600 max-w-md mb-8 leading-relaxed'>
                        Un banquete de dudas, un concurso de nada, donde la invitación es una pregunta malvada.
                        Entre rostros borrosos y una meta disfrazada, el propósito gira en una espiral
                        cansada que nunca halla la entrada.
                    </p>

                    {/* Contenedor relativo para que el botón no empuje otros elementos al moverse */}
                    <div className="relative h-12 w-40 flex justify-center md:justify-start">
                        <button
                            className='bg-[#4db69e] hover:bg-[#3d9682] text-white px-8 py-2 rounded-full font-bold transition-all shadow-md'
                            style={{
                                position: 'absolute', // Cambiado a absolute para que el movimiento sea fluido sobre el eje
                                top: `${buttonPosition.top}px`,
                                left: `${buttonPosition.left}px`,
                                transition: 'all 0.2s ease-out',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={moveButton}
                            onClick={(e) => { e.preventDefault(); moveButton(); }}
                        >
                            Explicar??
                        </button>
                    </div>
                </div>

                {/* COLUMNA IMAGEN: Usamos flex-1 para balancear */}
                <div className='flex-1 flex justify-center items-center'>
                    <img
                        src="/2725463.svg"
                        alt="People searching"
                        className="w-full max-w-sm md:max-w-xl transform md:scale-110 lg:scale-125"
                    />
                </div>

            </section>

            {/* SECCIÓN INTERMEDIA: TÍTULO DIVISOR */}
            <div className="text-center py-2">
                <div className="w-1/3 h-[2px] bg-[#4db69e] mx-auto mb-4"></div>
                <h3 className='text-3xl font-black text-gray-800 mb-4 agu-display'>
                    ¿Que te esperara?
                </h3>
            </div>

            {/* SECCIÓN INFERIOR: CARRUSEL DE TARJETAS DE AMIGOS */}
            <div className="max-w-7xl mx-auto px-10 pb-12 pt-2">
                {/* Primera fila: de derecha a izquierda - Primera mitad */}
                <div className="overflow-hidden mb-8 fade-edges">
                    <div className="flex animate-scroll-right-to-left">
                        {[...Friends.slice(0, Math.ceil(Friends.length / 2)), ...Friends.slice(0, Math.ceil(Friends.length / 2))].map((friend, index) => (
                            <div key={`${friend.id}-${index}`} className=" w-64 mx-4 hover:scale-105 transition-all">
                                <FriendCard
                                    NickName={friend.NickName}
                                    Attempts={friend.Attempts}
                                    Icon={friend.Icon}
                                    Color={friend.Color}
                                    isFinished={friend.isFinished}
                                    FriendId={friend.id}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Segunda fila: de izquierda a derecha - Segunda mitad */}
                <div className="overflow-hidden fade-edges">
                    <div className="flex animate-scroll-left-to-right">
                        {[...Friends.slice(Math.ceil(Friends.length / 2)), ...Friends.slice(Math.ceil(Friends.length / 2))].map((friend, index) => (
                            <div key={`${friend.id}-${index}-row2`} className=" w-64 mx-4 hover:scale-105 transition-all">
                                <FriendCard
                                    NickName={friend.NickName}
                                    Attempts={friend.Attempts}
                                    Icon={friend.Icon}
                                    Color={friend.Color}
                                    isFinished={friend.isFinished}
                                    FriendId={friend.id}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HomePage;