const connectToDB = require('./connectToDB');
const { addCards, iconsToList, makeCamelCase, setResultRange } = require('./importHelpers');

const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');

const Hitter = require('../models/Hitter');


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