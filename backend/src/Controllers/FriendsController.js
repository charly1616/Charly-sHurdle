import { getAllFriends, getFriendById, getQuestionsForFriend } from '../lib/FriendsUtils.js';

class FriendsController {
    static async getAllFriends(req, res) {
        try {
            // Agregamos await porque ahora es una promesa
            const friendsData = await getAllFriends();
            
            const friends = friendsData.map(friend => {
                const { Questions, ...rest } = friend;
                return rest;
            });
            
            res.json(friends);
        } catch (error) {
            console.error('Error in getAllFriends controller:', error);
            res.status(500).json({ error: 'Error retrieving friends' });
        }
    }

    static async getFriend(req, res) {
        try {
            const id = parseInt(req.params.id);
            // Agregamos await
            const friend = await getFriendById(id);

            if (friend) {
                const { Questions, ...filteredFriend } = friend;
                res.json({ ...filteredFriend });
            } else {
                res.status(404).json({ error: 'Friend not found' });
            }
        } catch (error) {
            console.error('Error in getFriend controller:', error);
            res.status(500).json({ error: 'Error retrieving friend' });
        }
    }

    static async getFriendQuestions(req, res) {
        try {
            const id = parseInt(req.params.id);
            // Agregamos await
            const questions = await getQuestionsForFriend(id);
            
            if (questions) {
                res.json(questions);
            } else {
                res.status(404).json({ error: 'Friend or questions not found' });
            }
        } catch (error) {
            console.error('Error in getFriendQuestions controller:', error);
            res.status(500).json({ error: 'Error retrieving questions' });
        }
    }
}

export default FriendsController;