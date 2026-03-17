import express from 'express';
import mongoose from 'mongoose'; // <-- 1. Importar Mongoose
import { ENV } from '../env.js';
import cors from 'cors';
import path from 'path';

import FriendsRoutes from './Routes/FriendsRoutes.js';
import SuggestionsRoute from './Routes/SuggestionsRoute.js';
import CheckRoute from './Routes/CheckRoute.js';

const __dirname = path.resolve();
const app = express();

// Configuración de CORS
app.use(cors({ 
    origin: "https://charly-s-hurdlefrontend.vercel.app", 
    credentials: true 
}));

// Middleware para Headers y Red Privada
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://charly-s-hurdlefrontend.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Private-Network", "true");

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.json());

// Rutas API
app.use("/api/Friends", FriendsRoutes);
app.use('/api/suggestions', SuggestionsRoute);
app.use('/api/answers', CheckRoute);

// Producción
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// --- 2. FUNCIÓN DE INICIO ASÍNCRONA ---
const startServer = async () => {
    try {
        console.log('⏳ Conectando a MongoDB Atlas...');
        
        // Conexión obligatoria antes de escuchar peticiones
        await mongoose.connect(ENV.MONGODB_URL);
        
        console.log('✅ Conexión exitosa a MongoDB');

        const PORT = ENV.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error crítico al iniciar:', error.message);
        // Si no hay DB, el servidor no debe intentar correr
        process.exit(1);
    }
};

startServer();

export default app;