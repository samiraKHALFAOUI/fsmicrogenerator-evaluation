const mongoose = require('mongoose');

const whitelistSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['ip', 'user'],
        required: true
    },
    key: {
        type: String,
        required: true
    },
    rateLimit: {
        window: {
            type: Number,
            required: true
        },
        limit: {
            type: Number,
            required: true
        }
    }
});

module.exports = mongoose.model('whitelist', whitelistSchema);
