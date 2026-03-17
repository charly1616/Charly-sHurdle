import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: [true, 'El ID de la pregunta es obligatorio'],
    index: true // Indexado para búsquedas rápidas por pregunta
  },
  friendId: {
    type: Number,
    required: [true, 'El ID del amigo es obligatorio'],
    index: true // Indexado para filtrar intentos por amigo
  },
  answerGiven: {
    type: String,
    required: true,
    trim: true
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now // Si no envías fecha, se pone la actual
  }
}, {
  // Esto añade automáticamente createdAt y updatedAt si lo deseas
  timestamps: false, 
  versionKey: false // Quita el campo __v que MongoDB pone por defecto
});

const Attempt = mongoose.model('Attempt', attemptSchema);

// Exportar el modelo
export default Attempt;