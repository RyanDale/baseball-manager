const connectToDB = require('./connectToDB');
const { addCards, transformPlayer } = require('./importHelpers');

const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');

const Pitcher = require('../models/Pitcher');


function setCMD(pitcher) {
    if (parseInt(pitcher.cmdPlus) === 0) {
        pitcher.cmdPlus = {};
        return pitcher;
    }
    const cmd = pitcher.cmdPlus.split('+');
    const boost = cmd[1];
    pitcher.cmdPlus = {};
    pitcher.cmdPlus[cmd[0] === 'L' ? 'left' : 'right'] = boost;
    return pitcher;
}

connectToDB().then(() => {
    const readStream = fs.createReadStream('./assets/pitchers2019.csv');

    const alterKeyNames = [
        ['hnd', 'hand'],
        ['sal', 'salary'],
        ['clt', 'clutch'],
        ['xR', 'xRange'],
        ['fld', 'fielding'],
    ];
    const resultKeys = [
        'k', 'gb', 'fb', 'bb', '_1B', '_2B', 'hr', 'xRange'
    ];
    const intKeys = ['salary', 'clutch', 'fielding', 'cmd'];

    let records = [];
    readStream.pipe(csv())
        .on('data', record => records.push(record))
        .on('end', () => {
            readStream.destroy();
            records = records.map(player => transformPlayer(player, alterKeyNames, resultKeys, intKeys));
            addCards(records);
            Pitcher.deleteMany({}, () => {
                const pitchers = records.map(record => new Pitcher(record)).map(setCMD);
                Pitcher.insertMany(pitchers).then(docs => {
                    console.log('Success', docs.length);
                }).catch(err => {
                    console.log('Error', err);
                    process.exit();
                });
            });
        });
});