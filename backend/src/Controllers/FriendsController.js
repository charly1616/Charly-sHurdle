import { getAllFriends, getFriendById, getQuestionsForFriend } from '../lib/FriendsUtils.js';

class FriendsController {
    static getAllFriends(req, res) {
        try {
            const friends = getAllFriends().map(friend => {
                const { Questions, ...rest } = friend;
                return rest;
            });
            res.json(friends);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error retrieving friends' });
        }
    }

    static getFriend(req, res) {
        try {
            const id = parseInt(req.params.id);
            const friend = getFriendById(id);

            if (friend) {
                const { Questions, ...filteredFriend } = friend;
                res.json({ ...filteredFriend });
            } else {
                res.status(404).json({ error: 'Friend not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving friend' });
        }
    }

    static getFriendQuestions(req, res) {
        try {
            const id = parseInt(req.params.id);
            const questions = getQuestionsForFriend(id);
            if (questions) {
                res.json(questions);
            } else {
                res.status(404).json({ error: 'Friend not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving questions' });
        }
    }
}

export default FriendsController;