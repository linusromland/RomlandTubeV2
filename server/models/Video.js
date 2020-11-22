const mongoose = require('mongoose');

//Creates the VideoSchema and exports it
const VideoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    thumbEnd: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    channel: {
        type: String,
        required: true
    },
    comments: {
        name: {
            type: String
        },
        comment: {
            type: String
        },
        date: {
            type: Date
        },
        likes: {
            type: Number
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;