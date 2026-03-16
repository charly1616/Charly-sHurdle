import express from 'express';
import FriendsController from '../Controllers/FriendsController.js';

const router = express.Router();

router.get('/', FriendsController.getAllFriends);

router.get('/:id', FriendsController.getFriend);

router.get('/:id/questions', FriendsController.getFriendQuestions);

export default router;


