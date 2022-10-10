const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .select('-__v')
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
            .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        User.bulkWrite(
            [
                { updateOne: {
                    filter: { _id: req.params.userId },
                    update: {
                        $addToSet: { friends: req.params.friendId }
                    }
                }},
                { updateOne: {
                    filter: { _id: req.params.friendId },
                    update: {
                        $addToSet: { friends: req.params.userId }
                    }
                }}
            ]
        )
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user with this id!' })
                    : res.status(200).json({ message: 'Friend added!' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    removeFriend(req, res) {
        User.bulkWrite(
            [
                { updateOne: {
                    filter: { _id: req.params.userId },
                    update: {
                        $pull: { friends: req.params.friendId }
                    }
                }},
                { updateOne: {
                    filter: { _id: req.params.friendId },
                    update: {
                        $pull: { friends: req.params.userId }
                    }
                }}
            ]
        )
            .then((user) => 
                    !user
                        ? res.status(404).json({ message: 'No user with this id!' })
                        : res.status(200).json({ message: 'Friend deleted!' })
                )
                .catch((err) => {
                    console.log(err);
                    res.status(500).json(err);
                });
    }
};