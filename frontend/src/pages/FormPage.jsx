import React from 'react';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LiveHearts from '../components/LiveHearts';
import { stringify } from 'postcss';

const FormPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState(null); // Cambiado a null para manejar mejor el index 0
    const [feedback, setFeedback] = useState({ message: "", isVisible: false, isCorrect: false });
    const [currentQuestion, setCurrentQuestion] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { FriendId } = location.state || {};
    const [colorBase, setColorBase] = useState("#606060");
    const [friend, setFriend] = useState({});

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!FriendId) return;

        const loadFriend = async () => {
            try {
                const response = await fetch(
                    `https://charlyshurdlebackend-tau.vercel.app/api/friends/${FriendId}`
                );

                if (!response.ok) throw new Error('Error en la red');

                const data = await response.json();

                if (data) setFriend(data);

            } catch (error) {
                console.error('Error fetching friend data:', error);
            }
        };

        loadFriend();
    }, [FriendId]);


    useEffect(() => {
        setColorBase(friend.Attempts >= 4 ? "#606060" : friend.Color);
    }, [friend]);

    useEffect(() => {
        if (questions.length > 0) {
            setCurrentQuestion(questions[0]);
        } else if (friend.id) {
            navigate("/success", { state: { FriendId }});
        }
    }, [questions, friend.id, navigate, FriendId]);

    const updateUser = () => {
    // 1. Iniciamos estado de carga para evitar saltos de lógica
    setLoading(true); 

    // 2. Usamos la ruta en minúsculas para compatibilidad con Linux/Vercel
    fetch(`https://charlyshurdlebackend-tau.vercel.app/api/friends/${FriendId}/questions`)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener preguntas');
            return response.json();
        })
        .then(data => {
            // Validación: Si no hay preguntas, detenemos la carga y dejamos que el useEffect de navegación actúe
            if (!data || data.length === 0) {
                setLoading(false);
                return;
            }

            // Fisher-Yates Shuffle (Barajado real)
            let scrambled = [...data];
            for (let i = scrambled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
            }

            // 3. Actualizamos el estado. 
            // Tip: Si currentQuestion depende de questions[0], 
            // asegúrate de que tu JSX use questions[0] directamente para evitar desincronización.
            setQuestions(scrambled);
            setCurrentQuestion(scrambled[0]);
            
            // Finalizamos carga
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            setLoading(false); // Importante: liberar el loading aunque falle
        });
};

    useEffect(() => {
        if (FriendId) updateUser();
    }, [FriendId]);

    const handleCheckAnswer = async () => {
        if (!questions.length) return;

        const curQue = questions[0];
        setFeedback({ message: "Verificando...", isVisible: true, isCorrect: false });

        fetch(`https://charlyshurdlebackend-tau.vercel.app/api/answers/check/${curQue.id}/${FriendId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "AnswerGiven": currentAnswer })
        })
            .then(res => res.json())
            .then(result => {
                
                if (result.isCorrect) {
                    setFeedback({ message: result.feedback || "¡Correcto!", isVisible: true, isCorrect: true });
                    setTimeout(() => {
                        setQuestions(prev => prev.slice(1));
                        setCurrentAnswer(null);
                        setFeedback({ message: "", isVisible: false, isCorrect: false });
                    }, 1500);
                } else if (result.status === 200) {
                    setFeedback({
                        message: curQue.FeedbackNegative || "Incorrecto, intentalo de nuevo",
                        isVisible: true,
                        isCorrect: false
                    });

                    setFriend({ ...friend, Attempts: (friend.Attempts + 1) })
                } else {
                    setFeedback({
                        message: JSON.stringify(result),
                        isVisible: true,
                        isCorrect: false
                    });
                }
            })
            .catch(error => console.error("Error al chequear:", error));
    };


    return (
        <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
            {/* HEADER ADAPTATIVO */}
            <header className='w-full px-6 md:px-12 py-4'>
                <section
                    className="flex items-center justify-between w-full pb-4 border-b-4 transition-all duration-300"
                    style={{ borderColor: colorBase }}
                >
                    <div className="flex items-center gap-3 md:gap-4">
                        <div
                            className="flex w-10 h-10 md:w-12 md:h-12 rounded-full justify-center items-center shadow-sm shrink-0"
                            style={{ backgroundColor: colorBase }}
                        >
                            <i className={`${friend.Icon} text-white text-xl md:text-2xl`}></i>
                        </div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-800 truncate max-w-[150px] md:max-w-none">
                            {friend.FullName}
                        </h1>
                    </div>

                    {
                        ((friend.Attempts >= 4) && <div className='text-gray-500'>
                            <h2>Se te acabaron las vidas pero aún así puedes seguir intentando</h2>
                        </div>
                        )
                    }

                    <div className="flex items-center gap-2">
                        <LiveHearts Attempts={friend.Attempts} isFinished={false} TextSize={"2rem"} />
                    </div>
                </section>
            </header>

            {/* CONTENEDOR PRINCIPAL FLEXIBLE */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-4xl rounded-[2rem] shadow-sm overflow-hidden flex flex-col">

                    {(currentQuestion) ? (
                        <div className="p-6 md:p-12 flex flex-col gap-6">
                            {/* Título de la pregunta */}
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 text-center leading-tight">
                                {currentQuestion.Body}
                            </h2>

                            {/* Imagen ajustada */}
                            {currentQuestion.ImageName && (
                                <div className="flex justify-center bg-gray-50 rounded-2xl p-4 overflow-hidden border-2 border-gray-100 max-h-[180px]">
                                    <img
                                        src={`/${currentQuestion.ImageName}`}
                                        alt="Desafío"
                                        className="max-h-48 md:max-h-64 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Opciones o Input */}
                            <div className="w-full">
                                {currentQuestion.Answer && currentQuestion.Answer.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        {currentQuestion.Answer.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => {
                                                    e.preventDefault(); setCurrentAnswer(idx)
                                                }}
                                                className={`p-4 md:p-5 rounded-2xl border-2 text-left transition-all font-semibold text-base md:text-lg ${currentAnswer === idx
                                                        ? "border-[#4db69e] bg-[#4db69e]/10 text-[#4db69e] ring-2 ring-[#4db69e]/20"
                                                        : "border-gray-100 hover:border-gray-200 bg-white text-gray-600"
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={currentAnswer || ""}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="Escribe tu respuesta aquí..."
                                        className="w-full p-4 md:p-5 rounded-2xl border-2 border-gray-100 focus:border-[#4db69e] focus:ring-4 focus:ring-[#4db69e]/10 outline-none text-lg md:text-xl transition-all"
                                    />
                                )}
                            </div>

                            {/* Mensajes de Feedback */}
                            <div className={`h-14 flex items-center justify-center transition-all duration-300 ${feedback.isVisible ? 'opacity-100' : 'opacity-0'}`}>
                                <div className={`px-6 py-2 rounded-full font-bold text-sm md:text-base shadow-sm ${feedback.isCorrect ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"
                                    }`}>
                                    {feedback.message}
                                </div>
                            </div>

                            {/* Botones inferiores */}
                            <div className="flex flex-col sm:flex-row gap-10 pt-4 border-t border-gray-50">
                                <button
                                    className="order-2 sm:order-1 flex-1 py-2 text-gray-400 font-bold hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-all"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigate("/");
                                    }}
                                >
                                    Me rindo
                                </button>
                                <button
                                    onClick={(e) => {e.preventDefault();handleCheckAnswer();}}
                                    disabled={currentAnswer === null || currentAnswer === ""}
                                    className="order-1 sm:order-2 flex-row flex-[2] bg-[#4db69e] text-white py-2 md:py-1 px-4 rounded-2xl font-black text-lg md:text-xl shadow-md shadow-[#4db69e]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                                >
                                    Enviar respuesta
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4db69e] mx-auto mb-4"></div>
                            <h2 className="text-xl font-bold text-gray-400">Cargando siguiente desafío...</h2>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FormPage;