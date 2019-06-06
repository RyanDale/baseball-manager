const express = require('express');
const router = express.Router();

const fs = require('fs');
const mongoose = require('mongoose');
const Pitcher = require('../models/Pitcher');
const Grid = require('gridfs-stream');


router.get('/', (req, res) => {
    const query = req.query.withCards ? { card: { $ne: null } } : {};
    Pitcher.find(query).sort({
        created: -1,
    }).then(pitchers => res.json(pitchers));
});

router.get('/:id', (req, res) => {
    Pitcher.findById(req.params.id)
        .then(pitcher => res.json(pitcher))
        .catch(e => {
            return res.status(404).json({
                success: false
            });
        });
});

router.get('/:id/card', (req, res) => {
    Pitcher.findById(req.params.id)
        .then(pitcher => {
            const GridFS = Grid(mongoose.connection.db, mongoose.mongo);
            try {
                const readstream = GridFS.createReadStream({ _id: pitcher.card });
                readstream.on('error', function () {
                    const img = fs.readFileSync('./utils/empty-card.png');
                    res.writeHead(200, {
                        'Content-Type': 'image/png'
                    });
                    res.end(img, 'binary');
                });
                readstream.pipe(res);
            } catch (err) {
                return next(errors.create(404, "File not found."));
            }
        });
});

module.exports = router;
