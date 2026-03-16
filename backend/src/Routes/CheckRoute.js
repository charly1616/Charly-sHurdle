import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import askGemini from '../lib/LLM.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsPath = path.join(__dirname, '../lib/GeneralQuestions.json');
const attemptsPath = path.join(__dirname, '../lib/Attempts.json');

const router = express.Router();

// Load questions
let questions = [];
try {
  const data = fs.readFileSync(questionsPath, 'utf8');
  questions = JSON.parse(data);
} catch (error) {
  console.error('Error loading questions:', error);
}

// Get question by ID
function getQuestionById(id) {
  return questions.find(q => q.id === id);
}

// Save attempt
function saveAttempt(questionId, friendId, answerGiven, isCorrect) {
  try {
    let attempts = [];
    if (fs.existsSync(attemptsPath)) {
      const data = fs.readFileSync(attemptsPath, 'utf8');
      attempts = JSON.parse(data);
    }
    attempts.push({
      questionId: parseInt(questionId),
      friendId: parseInt(friendId),
      answerGiven,
      isCorrect,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync(attemptsPath, JSON.stringify(attempts, null, 2));
  } catch (error) {
    console.error('Error saving attempt:', error);
  }
}

// Route to check answer
router.post('/check/:id/:FriendId', async (req, res) => {
  const { id, FriendId } = req.params;
  const { AnswerGiven } = req.body;

  if (!AnswerGiven && AnswerGiven!==0) {
    return res.status(400).json({ error: 'AnswerGiven is required' });
  }

  const question = getQuestionById(parseInt(id));
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  let isCorrect = false;

  if (question.Answer && question.Answer.length > 0) {
    // Multiple choice
    const givenIndex = parseInt(AnswerGiven);
    if (!isNaN(givenIndex) && question.Correct.includes(givenIndex)) {
      isCorrect = true;
    }
  } else {
    // Open-ended, use Gemini
    const prompt = `Question: ${question.Body}\nCorrect Answer: ${question.Correct}\nUser Answer: ${AnswerGiven}\nIs the user answer correct or very similar to the correct answer? Respond with only 'yes' or 'no'.`;
    try {
      const response = await askGemini(prompt);
      if (response && response.toLowerCase().includes('yes')) {
        isCorrect = true;
      } else if (response && (response.toLowerCase().includes('no') || response.toLowerCase().includes('yes'))) {
        // Valid response, if not yes, it's incorrect
        // Save failed attempt
        saveAttempt(id, FriendId, AnswerGiven, false);
      }
      // If response is invalid or null, don't save
    } catch (error) {
      console.error('Error with AI:', error);
      return res.status(500).json({ error: 'Error checking answer' });
    }
  }

  if (!isCorrect && question.Answer && question.Answer.length > 0) {
    // For multiple choice, save failed if incorrect
    saveAttempt(id, FriendId, AnswerGiven, false);
  }
  if (isCorrect) {
    saveAttempt(id, FriendId, AnswerGiven, true);
  }
  res.json({
    status: 200,
    isCorrect,
    feedback: isCorrect ? ('Correctooo!') : (question.FeedbackNegative || 'Incorrect.')
  });
});

export default router;