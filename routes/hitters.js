const express = require('express');
const router = express.Router();

const fs = require('fs');
const mongoose = require('mongoose');
const Hitter = require('../models/Hitter');
const Grid = require('gridfs-stream');


router.get('/', (req, res) => {
    const query = req.query.withCards ? { card: { $ne: null } } : {};
    Hitter.find(query).sort({
        created: -1,
    }).then(hitters => res.json(hitters));
});

router.get('/:id', (req, res) => {
    Hitter.findById(req.params.id)
        .then(hitter => res.json(hitter))
        .catch(e => {
            return res.status(404).json({
                success: false
            });
        });
});

router.get('/:id/card', (req, res) => {
    Hitter.findById(req.params.id)
        .then(hitter => {
            const GridFS = Grid(mongoose.connection.db, mongoose.mongo);
            try {
                const readstream = GridFS.createReadStream({ _id: hitter.card });
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
