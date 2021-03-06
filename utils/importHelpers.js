const _ = require('lodash');
const fs = require('fs');

const { createBucket } = require('mongoose-gridfs');

function addCards(players) {
    let playersWithCards = [];
    players.forEach(hitter => {
        let cleanName = name => name.replace(/[\s.-]/g, '').toLowerCase();
        let fileName = `${cleanName(hitter.firstName)}-${cleanName(hitter.lastName)}.png`;
        let filePath = `./assets/cards/${fileName}`;
        if (fs.existsSync(filePath)) {
            const bucket = createBucket();
            const readStream = fs.createReadStream(filePath);
            const writeStream = bucket.writeFile({ filename: fileName }, readStream);
            hitter.card = writeStream.id;
            playersWithCards.push(hitter);
        }
    });
}

function iconsToList(player) {
    let key;
    player.icons = []
    _.times(6, i => {
        key = `icon${i + 1}`;
        if (player[key]) {
            player.icons.push(player[key]);
        }
        delete player[key];
    });
}

function makeCamelCase(obj, oldKey) {
    // Replace plus signs
    let newKey = _.camelCase(oldKey.replace('+', 'Plus'));

    // Ensure illegal keys aren't created
    if (newKey.match(/^\d/)) {
        newKey = `_${newKey}`;
    }

    delete Object.assign(obj, { [newKey]: obj[oldKey] })[oldKey];
}

function setResultRange(value) {
    if (value === '-') {
        return [];
    }

    value = value.split('-');
    if (value.length === 1) {
        if (value[0].includes('+')) {
            return [parseInt(value[0].split('+')[0]), 50];
        } else {
            return [parseInt(value[0]), parseInt(value[0])];
        }
    } else if (value.length === 2) {
        return [parseInt(value[0]), parseInt(value[1])];
    }
}

function transformPlayer(player, alterKeyNames=[], resultKeys=[], intKeys=[]) {
    _.keys(player).forEach(key => makeCamelCase(player, key));

    alterKeyNames.forEach(key => {
        delete Object.assign(player, { [key[1]]: player[key[0]] })[key[0]];
    });

    resultKeys.forEach(key => {
        player[key] = setResultRange(player[key]);
    });

    intKeys.forEach(key => {
        player[key] = parseInt(player[key]);
    });

    player['positionList'] = player['pos'].split('/');

    // Useful for when working with pitchers
    player['primaryPosition'] = player['pos'].split('/')[0];
    iconsToList(player);
    return player;
}

module.exports = {
    addCards,
    transformPlayer
}
