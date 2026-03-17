import express from 'express';
import askAI from '../lib/LLM.js';
// Importamos los modelos directamente para las operaciones de escritura/lectura
import Question from '../Models/Question.js';
import Attempt from '../Models/Attempt.js';

const router = express.Router();

/**
 * Lógica para guardar intentos en MongoDB
 */
async function saveAttempt(questionId, friendId, answerGiven, isCorrect) {
  try {
    const newAttempt = new Attempt({
      questionId: parseInt(questionId),
      friendId: parseInt(friendId),
      answerGiven: String(answerGiven),
      isCorrect: isCorrect,
      timestamp: new Date()
    });
    await newAttempt.save();
  } catch (error) {
    console.error('Error al guardar el intento en MongoDB:', error);
  }
}

// Ruta para verificar la respuesta
router.post('/check/:id/:FriendId', async (req, res) => {
  const { id, FriendId } = req.params;
  const { AnswerGiven } = req.body;

  // Validación básica de entrada
  if (AnswerGiven === undefined || AnswerGiven === null || AnswerGiven === '') {
    return res.status(400).json({ error: 'AnswerGiven is required' });
  }

  try {
    // 1. Buscar la pregunta en MongoDB
    const question = await Question.findOne({ id: parseInt(id) }).lean();
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    let isCorrect = false;
    let genRes = "";

    // 2. Lógica de validación
    if (question.Answer && question.Answer.length > 0) {
      // Opción múltiple
      const givenIndex = parseInt(AnswerGiven);
      // Asumiendo que Correct contiene los índices válidos
      if (!isNaN(givenIndex) && question.Correct.includes(String(givenIndex))) {
        isCorrect = true;
      }
    } else {
      // Pregunta abierta: Usar Gemini
      const prompt = `Question: ${question.Body}\nCorrect Answer: ${question.Correct}\nUser Answer: ${AnswerGiven}\nIs the user answer correct or similar to the correct answer? Respond with only 'yes' or 'no'.`;
      
      const aiResponse = await askAI(prompt);
      const cleanedResponse = aiResponse?.toLowerCase() || '';

      if (cleanedResponse.includes('yes')) {
        isCorrect = true;
      } else if (cleanedResponse.includes('no')) {
        isCorrect = false;
      } else {
        res.json({
          status: 500,
          message: "Error de gemini : " + aiResponse
        });
      }
    }

    // 3. Guardar el resultado en la base de datos (sea correcto o no)
    await saveAttempt(id, FriendId, AnswerGiven, isCorrect);

    // 4. Responder al cliente
    res.json({
      status: 200,
      isCorrect,
      feedback: isCorrect 
        ? 'Correctooo!' 
        : (question.FeedbackNegative || 'Incorrecto, sigue intentando.')
    });

  } catch (error) {
    console.error('Error general en el proceso de check:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;