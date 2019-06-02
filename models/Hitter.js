const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HitterSchema = new Schema({
    set: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    hand: {
        type: String,
        required: true
    },
    fielding: {
        type: Number,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    clutch: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    positionList: {
        type: [String],
        required: true
    },
    primaryPosition: {
        type: String,
        required: true
    },
    ob: {
        type: Number,
        required: true
    },
    obPlus: {
        type: Object,
        required: true
    },
    // Result Charts
    k: {
        type: [],
        required: true
    },
    gb: {
        type: [],
        required: true
    },
    fb: {
        type: [],
        required: true
    },
    bb: {
        type: [],
        required: true
    },
    _1B: {
        type: [],
        required: true
    },
    _2B: {
        type: [],
        required: true
    },
    _3B: {
        type: [],
        required: true
    },
    hr: {
        type: [],
        required: true
    },
    icons: {
        type: [String],
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    card: {
        type: Schema.Types.ObjectId
    }
});

module.exports = Hitter = mongoose.model('Hitter', HitterSchema);
