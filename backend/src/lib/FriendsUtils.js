// Asegúrate de que el nombre sea Friend o Friends según tu archivo real
import Friend from '../Models/Friend.js';
import Question from '../Models/Question.js';
import Attempt from '../Models/Attempt.js';

/**
 * Obtiene todos los amigos y calcula si terminaron sus preguntas 
 * y cuántos intentos fallidos tienen.
 */
async function getAllFriends() {
    try {
        const friends = await Friend.find().lean();
        const attempts = await Attempt.find().lean();

        return friends.map(friend => {
            const failedAttempts = attempts.filter(a => a.friendId === friend.id && !a.isCorrect).length;
            const correctIds = new Set(
                attempts
                    .filter(a => a.friendId === friend.id && a.isCorrect && friend.Questions.includes(a.questionId))
                    .map(a => a.questionId)
            );
            
            const isFinished = correctIds.size >= friend.Questions.length;

            return {
                ...friend,
                isFinished,
                Attempts: failedAttempts
            };
        });
    } catch (error) {
        console.error("Error en getAllFriends:", error);
        return [];
    }
}

/**
 * Obtiene un amigo específico por su ID manual
 */
async function getFriendById(id) {
    try {
        const friend = await Friend.findOne({ id }).lean();
        if (!friend) return null;

        const attempts = await Attempt.find({ friendId: id }).lean();

        const correctIds = new Set(
            attempts
                .filter(a => a.isCorrect && friend.Questions.includes(a.questionId))
                .map(a => a.questionId)
        );

        const isFinished = correctIds.size >= friend.Questions.length;
        const failedAttempts = attempts.filter(a => !a.isCorrect).length;

        return {
            ...friend,
            isFinished,
            Attempts: failedAttempts
        };
    } catch (error) {
        console.error("Error en getFriendById:", error);
        return null;
    }
}

/**
 * Obtiene las preguntas restantes para un amigo (sin el campo 'Correct')
 */
async function getQuestionsForFriend(friendId) {
    try {
        const friend = await Friend.findOne({ id: friendId }).lean();
        if (!friend) return null;

        const attempts = await Attempt.find({ friendId, isCorrect: true }).lean();
        const answeredQuestionIds = attempts.map(a => a.questionId);

        // Filtramos los IDs de preguntas que el amigo aún no ha respondido bien
        const remainingQuestionIds = friend.Questions.filter(qId => !answeredQuestionIds.includes(qId));

        // Buscamos las preguntas en la DB omitiendo el campo 'Correct' por seguridad
        const questions = await Question.find({ 
            id: { $in: remainingQuestionIds } 
        }).select('-Correct').lean();

        return questions;
    } catch (error) {
        console.error("Error en getQuestionsForFriend:", error);
        return [];
    }
}

/**
 * Cuenta los intentos fallidos de un amigo
 */
async function getFailedAttemptsForFriend(friendId) {
    try {
        const count = await Attempt.countDocuments({ friendId, isCorrect: false });
        return count;
    } catch (error) {
        console.error("Error en getFailedAttemptsForFriend:", error);
        return 0;
    }
}

export { getAllFriends, getFriendById, getQuestionsForFriend, getFailedAttemptsForFriend };