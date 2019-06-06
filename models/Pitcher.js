const mongoose = require('mongoose');
const PlayerSchema = require('./Player');

const Schema = mongoose.Schema;

const PitcherSchema = new Schema({
    ...PlayerSchema,
    ip: {
        type: Number,
        required: true
    },
    cmd: {
        type: Number,
        required: true
    },
    cmdPlus: {
        type: Object,
        required: true
    },
    xRange: {
        type: [],
        required: true
    }
});

module.exports = Hitter = mongoose.model('Pitcher', PitcherSchema);
