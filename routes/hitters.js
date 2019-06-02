const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Hitter = require('../models/Hitter');
const Grid = require('gridfs-stream');


router.get('/', (req, res) => {
    Hitter.find().sort({
        created: -1
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
                var readstream = GridFS.createReadStream({ _id: hitter.card });
                readstream.pipe(res);
            } catch (err) {
                console.log(err);
                return next(errors.create(404, "File not found."));
            }
        })
        .catch(e => {
            console.log(e);
            return res.status(404).json({
                success: false
            });
        });
});

module.exports = router;
