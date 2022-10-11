const connection = require('../config/connection');
const User = require('../models/User');
const Thought = require('../models/Thought');
// const reactionSchema = require('../models/Reaction');
const { userData, thoughtData} = require('./data');

console.time('seeding');

connection.once('open', async () => {
    await User.deleteMany({});
    await Thought.deleteMany({});

    await User.collection.insertMany(userData);

    console.table(userData);
    console.timeEnd('seeding complete 🌱');
    process.exit(0);
})