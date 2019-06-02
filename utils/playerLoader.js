const connectToDB = require('./connectToDB');

const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');

const { createBucket } = require('mongoose-gridfs');

const Hitter = require('../models/Hitter');

function makeCamelCase(obj, oldKey) {
    // Replace plus signs
    let newKey = _.camelCase(oldKey.replace('+', 'Plus'));

    // Ensure illegal keys aren't created
    if (newKey.match(/^\d/)) {
        newKey = `_${newKey}`;
    }

    delete Object.assign(obj, { [newKey]: obj[oldKey] })[oldKey];
}

function iconsToList(batter) {
    let key;
    batter.icons = []
    _.times(6, i => {
        key = `icon${i + 1}`;
        if (batter[key]) {
            batter.icons.push(batter[key]);
        }
        delete batter[key];
    });
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

function setOB(batter) {
    if (parseInt(batter.obPlus) === 0) {
        batter.obPlus = {};
        return;
    }
    const ob = batter.obPlus.split('+');
    const boost = ob[1];
    batter.obPlus = {};
    batter.obPlus[ob[0] === 'L' ? 'left' : 'right'] = boost;
}

function transformBatter(batter) {
    const alterKeyNames = [
        ['hnd', 'hand'],
        ['sal', 'salary'],
        ['clt', 'clutch'],
        ['spd', 'speed'],
        ['fld', 'fielding'],
    ];
    const resultKeys = [
        'k', 'gb', 'fb', 'bb', '_1B', '_2B', '_3B', 'hr'
    ];
    const intKeys = ['salary', 'clutch', 'fielding', 'ob', 'speed'];
    _.keys(batter).forEach(key => makeCamelCase(batter, key));

    alterKeyNames.forEach(key => {
        delete Object.assign(batter, { [key[1]]: batter[key[0]] })[key[0]];
    });

    resultKeys.forEach(key => {
        batter[key] = setResultRange(batter[key]);
    });

    intKeys.forEach(key => {
        batter[key] = parseInt(batter[key]);
    });

    batter['positionList'] = batter['pos'].split('/');

    setOB(batter);
    // Useful for when working with pitchers
    batter['primaryPosition'] = batter['pos'].split('/')[0];
    iconsToList(batter);
    return batter;
}

function addCards(hitters) {
    let hittersWithCards = [];
    hitters.forEach(hitter => {
        let fileName = `${hitter.firstName.replace(/ /g, '').toLowerCase()}-${hitter.lastName.replace(/ /g, '').toLowerCase()}.png`;
        if (fs.existsSync('./assets/cards/' + fileName)) {
            const bucket = createBucket();
            const filePath = './assets/cards/' + fileName;
            const readStream = fs.createReadStream(filePath);
            const writeStream = bucket.writeFile({ filename: fileName }, readStream);
            hitter.card = writeStream.id;
            hittersWithCards.push(hitter);
        }
    });
}

connectToDB().then(() => {
    const readStream = fs.createReadStream('./assets/batters2019.csv');
    let records = [];
    readStream.pipe(csv())
        .on('data', record => records.push(record))
        .on('end', () => {
            readStream.destroy();
            records = records.map(transformBatter);
            addCards(records);
            Hitter.deleteMany({}, () => {
                const hitters = records.map(record => new Hitter(record));
                Hitter.insertMany(hitters).then(docs => {
                    console.log('Success', docs.length);
                }).catch(err => {
                    console.log('Error', err);
                    process.exit();
                });
            });
        });
});