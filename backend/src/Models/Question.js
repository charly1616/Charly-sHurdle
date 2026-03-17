import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true // Para mantener el orden de tu JSON
  },
  Body: {
    type: String,
    required: true,
    trim: true
  },
  ImageName: {
    type: String,
    default: null // Solo algunas preguntas tienen imagen (como la del ID 4)
  },
  Answer: [{
    type: String // Por si en el futuro decides poner opciones múltiples
  }],
  Correct: [{
    type: String,
    required: true // El arreglo con la respuesta correcta
  }],
  FeedbackNegative: {
    type: String,
    trim: true
  }
}, {
  versionKey: false
});

// Exportación normal para Node.js
const Question = mongoose.model('Question', questionSchema);


export default Question;