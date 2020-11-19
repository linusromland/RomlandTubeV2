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
    thumbLink: {
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
    mime: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;