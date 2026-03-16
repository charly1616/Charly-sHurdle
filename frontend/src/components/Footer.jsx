import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook

const Footer = () => {
  const navigate = useNavigate(); // Inicializamos la función de navegación

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Contenedor principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">

          {/* Logo */}
          <div className="md:col-span-1 flex items-center justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <img
                src="/CharlypusDark.svg"
                alt="CharlyPus Logo"
                className="w-8 h-8" 
              />
              <h3 className="text-lg font-bold agu-display tracking-wide">Charlypus</h3>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="flex justify-center items-center">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110">
                <i className="fab fa-facebook-f text-base"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110">
                <i className="fab fa-twitter text-base"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110">
                <i className="fab fa-instagram text-base"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110">
                <i className="fab fa-github text-base"></i>
              </a>
            </div>
          </div>

          {/* BOTÓN PQR - Añadido aquí para equilibrio visual */}
          <div className="flex justify-center items-center">
            <button 
              onClick={(e) => {e.preventDefault();navigate("/pqr",{replace:true})}}
              className="text-[10px] font-bold uppercase tracking-widest bg-[#4db69e]/10 text-[#4db69e] border border-[#4db69e]/30 px-4 py-1 rounded hover:bg-[#4db69e] hover:text-white transition-all active:scale-95"
            >
              PQR & Soporte
            </button>
          </div>

          {/* Contacto */}
          <div className="flex justify-center items-center md:justify-end">
            <div className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
              <i className="fas fa-phone mr-2 text-[#4db69e] text-xs"></i>
              <span className="text-gray-300 text-xs font-medium">+57 314 159 2653</span>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-gray-500 text-[10px] font-medium text-center md:text-left">
              © 2026 Charly's Hurdle. Todos los derechos reservados.
            </div>
            <div className="flex space-x-4 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="text-gray-500 hover:text-[#4db69e] transition-colors">Privacidad</a>
              <a href="#" className="text-gray-500 hover:text-[#4db69e] transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;