const mongoose = require('mongoose');
const PlayerSchema = require('./Player');

const Schema = mongoose.Schema;

const HitterSchema = new Schema({
    ...PlayerSchema,
    speed: {
        type: Number,
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
    _3B: {
        type: [],
        required: true
    }
});

module.exports = Hitter = mongoose.model('Hitter', HitterSchema);
