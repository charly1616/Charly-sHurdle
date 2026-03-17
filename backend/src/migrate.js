import mongoose from 'mongoose';
import { ENV } from '../env.js'; // Ajustado según tu estructura de carpetas

// Importar los modelos (Asegúrate de incluir la extensión .js)
import Attempt from './Models/Attempt.js';
import Friend from './Models/Friend.js';
import Question from './Models/Question.js';

// Para importar JSON con 'import', necesitamos usar 'with { type: "json" }' 
// o leerlos con fs si tu versión de Node es antigua.
import attemptsData from './lib/Attempts.json' with { type: 'json' };
import friendsData from './lib/FriendsSource.json' with { type: 'json' };
import questionsData from './lib/GeneralQuestions.json' with { type: 'json' };

const migrate = async () => {
  try {
    console.log('--- Iniciando Migración ---');
    
    // 1. Conectar a MongoDB
    await mongoose.connect(ENV.MONGODB_URL);
    console.log('✅ Conectado a MongoDB Atlas');

    // 2. Limpiar colecciones actuales (CRÍTICO: usar await)
    console.log('🧹 Limpiando colecciones anteriores...');
    await Promise.all([
      Friend.deleteMany({}),
      Question.deleteMany({}),
      Attempt.deleteMany({})
    ]);

    // 3. Insertar Amigos
    if (friendsData.length > 0) {
      await Friend.insertMany(friendsData);
      console.log(`✅ ${friendsData.length} amigos migrados.`);
    }

    // 4. Insertar Preguntas
    if (questionsData.length > 0) {
      await Question.insertMany(questionsData);
      console.log(`✅ ${questionsData.length} preguntas migradas.`);
    }

    // 5. Insertar Intentos
    if (attemptsData.length > 0) {
      await Attempt.insertMany(attemptsData);
      console.log(`✅ ${attemptsData.length} intentos migrados.`);
    }

    console.log('--- Migración completada con éxito ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
};

migrate();