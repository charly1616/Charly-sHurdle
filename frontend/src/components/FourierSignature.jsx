import React, { useEffect, useRef, useState } from 'react';

const FourierSignature = ({ width = 500, height = 500, showEpicycles = true }) => {
  const canvasRef = useRef(null);
  const [data, setData] = useState(null);
  const [scaling, setScaling] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  
  const pathRef = useRef([]); // caminoReconstruido
  const timeRef = useRef(0);
  const animationRef = useRef(null);

  // 1. Cargar el JSON y calcular el escalado (Bounding Box)
  useEffect(() => {
    fetch('/CharlySign.json')
      .then(res => res.json())
      .then(json => {
        // Encontrar los límites de los puntos originales para centrar y escalar
        const xs = json.puntos.map(p => p.x);
        const ys = json.puntos.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const figureW = maxX - minX;
        const figureH = maxY - minY;

        // Escalar al 80% del tamaño del canvas para dejar margen
        const scale = Math.min(width / figureW, height / figureH) * 0.8;
        
        // El centro de la figura original
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        setScaling({ scale, centerX, centerY });

        // Ordenar coeficientes por amplitud (como hace Epidraw)
        const sorted = [...json.fourierCoefs].sort((a, b) => b.amplitud - a.amplitud);
        setData({ ...json, fourierCoefs: sorted });
      })
      .catch(err => console.error("Error al cargar CharlySign.json:", err));
  }, [width, height]);

  // 2. Loop de Animación basado en Epidraw
  useEffect(() => {
    if (!data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // El punto de inicio es el centro del canvas
      // Restamos el centro de la figura original escalado para que quede perfecto
      let x = width / 2;
      let y = height / 2;

      // Cantidad de círculos a mostrar según el config.textoA (porcentaje)
      const porcentaje = data.config.textoA / 100.0;
      const numCoefs = Math.floor(data.fourierCoefs.length * porcentaje);

      // Calculamos la posición sumando vectores (Epiciclos)
      for (let i = 0; i < numCoefs; i++) {
        let prevX = x;
        let prevY = y;

        const { frecuencia, amplitud, fase } = data.fourierCoefs[i];
        
        // Saltamos la frecuencia 0 en el dibujo de círculos porque ya centramos el canvas
        if (frecuencia === 0) continue; 

        const radius = amplitud * scaling.scale;
        const angulo = frecuencia * timeRef.current + fase;

        x += radius * Math.cos(angulo);
        y += radius * Math.sin(angulo);

        // Dibujar Epiciclos (Círculos y radios)
        if (showEpicycles) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(77, 182, 158, 0.15)"; // Tu color verde esmeralda con opacidad
          ctx.lineWidth = 1;
          ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = "rgba(77, 182, 158, 0.4)";
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }

      // Guardar en el rastro
      pathRef.current.push({ x, y });

      // Dibujar la firma (caminoReconstruido)
      ctx.beginPath();
      ctx.strokeStyle = data.config.lineColor || '#4db69e';
      ctx.lineWidth = data.config.valorSlider || 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let i = 0; i < pathRef.current.length; i++) {
        const p = pathRef.current[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // VELOCIDAD: dt basado en la cantidad de puntos para que el cierre sea exacto
      const dt = (2 * Math.PI) / data.fourierCoefs.length;
      timeRef.current += dt;

      // RESET LOOP (Igual que en Epidraw)
      if (timeRef.current > Math.PI * 2) {
        timeRef.current = 0;
        pathRef.current = [];
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [data, scaling, width, height, showEpicycles]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="bg-transparent pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};

export default FourierSignature;