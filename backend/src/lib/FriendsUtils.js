import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const friendsPath = path.join(__dirname, 'FriendsSource.json');
const questionsPath = path.join(__dirname, 'GeneralQuestions.json');
const attemptsPath = path.join(__dirname, 'Attempts.json');

// Load data
let friendsData = null;
let questionsData = null;
let attemptsData = null;

function loadFriendsData() {
    if (!friendsData) {
        const data = fs.readFileSync(friendsPath, 'utf8');
        friendsData = JSON.parse(data);
    }
    return friendsData;
}

function loadQuestionsData() {
    if (!questionsData) {
        const data = fs.readFileSync(questionsPath, 'utf8');
        questionsData = JSON.parse(data);
    }
    return questionsData;
}

function loadAttemptsData(forceReload = true) {
  if (!attemptsData || forceReload) {
    try {
      const data = fs.readFileSync(attemptsPath, 'utf8');
      attemptsData = JSON.parse(data);
    } catch (error) {
      attemptsData = [];
    }
  }
  return attemptsData;
}



function getAllFriends() {
    const friends = loadFriendsData();
    return AreFriendsFinished(friends.map(friend => ({
        ...friend,
        Attempts: getFailedAttemptsForFriend(friend.id),
    })));
}

function getFriendById(id) {
    const friends = loadFriendsData();
    const friend = friends.find(f => f.id === id);

    if (!friend) return null;

    // 1. Calculamos si terminó usando una lógica simple para un solo objeto
    // (Para evitar pasar un objeto solo a una función que espera arreglos)
    const attempts = loadAttemptsData();
    const correctIds = new Set(
        attempts
            .filter(a => a.friendId === id && a.isCorrect && friend.Questions.includes(a.questionId))
            .map(a => a.questionId)
    );
    
    const isFinished = correctIds.size >= friend.Questions.length;

    // 2. Obtenemos los intentos fallidos
    // IMPORTANTE: getFailedAttemptsForFriend NO debe llamar a getFriendById
    const failedAttempts = attempts.filter(a => a.friendId === id && !a.isCorrect).length;

    return {
        ...friend,
        isFinished,
        Attempts: failedAttempts
    };
}


//Populates friends with an isFinished property based on whether they have answered all their questions correctly
function AreFriendsFinished(friends) {
    const attempts = loadAttemptsData();

    return friends.map(friend => {
        const answeredCorrectly = attempts
            .filter(attempt => attempt.friendId === friend.id)
            .filter(attempt => attempt.isCorrect)
            .filter(attempt => friend.Questions.includes(attempt.questionId))
            .map(attempt => attempt.questionId);

        const answSet = new Set(answeredCorrectly);
        const isFinished = answSet.size >= friend.Questions.length;

        return { ...friend, isFinished };
    });
}

function getQuestionsForFriend(friendId) {
    const friend = getFriendById(friendId);
    if (!friend) return null;

    const questions = loadQuestionsData();
    const attempts = loadAttemptsData();
    const answeredQuestionIds = attempts
        .filter(attempt => attempt.friendId === friendId && attempt.isCorrect)
        .map(attempt => attempt.questionId);

    
    const friendQuestions = friend.Questions
        .filter(qId => !answeredQuestionIds.includes(qId))
        .map(qId => {
            const question = questions.find(q => q.id === qId);
            if (question) {
                // Create a copy without the Correct field
                const { Correct, ...questionWithoutCorrect } = question;
                return questionWithoutCorrect;
            }
            return null;
        })
        .filter(q => q !== null);

    return friendQuestions;
}

function getFailedAttemptsForFriend(friendId) {
    const attempts = loadAttemptsData();
    return attempts.filter(attempt => attempt.friendId === friendId && !attempt.isCorrect).length;
}

export { getAllFriends, getFriendById, getQuestionsForFriend, getFailedAttemptsForFriend };