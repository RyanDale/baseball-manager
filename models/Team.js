const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    hitters: [
        { type: Schema.Types.ObjectId, ref: 'Hitter' }
    ],
    pitchers: [
        { type: Schema.Types.ObjectId, ref: 'Pitcher' }
    ],
    created: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = Account = mongoose.model('Team', TeamSchema);
