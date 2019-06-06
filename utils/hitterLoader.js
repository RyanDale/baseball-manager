const connectToDB = require('./connectToDB');
const { addCards, transformPlayer } = require('./importHelpers');

const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');

const Hitter = require('../models/Hitter');


function setOB(batter) {
    if (parseInt(batter.obPlus) === 0) {
        batter.obPlus = {};
        return batter;
    }
    const ob = batter.obPlus.split('+');
    const boost = ob[1];
    batter.obPlus = {};
    batter.obPlus[ob[0] === 'L' ? 'left' : 'right'] = boost;
    return batter;
}

connectToDB().then(() => {
    const readStream = fs.createReadStream('./assets/batters2019.csv');

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

    let records = [];
    readStream.pipe(csv())
        .on('data', record => records.push(record))
        .on('end', () => {
            readStream.destroy();
            records = records.map(player => transformPlayer(player, alterKeyNames, resultKeys, intKeys));
            addCards(records);
            Hitter.deleteMany({}, () => {
                const hitters = records.map(record => new Hitter(record)).map(setOB);
                Hitter.insertMany(hitters).then(docs => {
                    console.log('Success', docs.length);
                }).catch(err => {
                    console.log('Error', err);
                    process.exit();
                });
            });
        });
});