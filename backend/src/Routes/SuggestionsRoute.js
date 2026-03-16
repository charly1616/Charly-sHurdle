import express from 'express';
import { sendSuggestionEmail } from '../lib/EmailService.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({
      error: 'El texto de la sugerencia es obligatorio'
    });
  }

  try {
    await sendSuggestionEmail(text);

    res.status(200).json({
      message: 'Sugerencia enviada correctamente'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'No se pudo enviar la sugerencia'
    });
  }
});

export default router;
