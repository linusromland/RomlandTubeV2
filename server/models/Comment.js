var SchemaObject = require('schema-object');

// Create Comment schema
var Comment = new SchemaObject({
    name: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Comment;