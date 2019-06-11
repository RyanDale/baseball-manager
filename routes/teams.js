const express = require('express');
const router = express.Router();

const Team = require('../models/Team');


router.get('/', (req, res) => {
    Team.find().sort({
        created: -1
    }).then(teams => res.json(teams));
});

router.get('/:id', (req, res) => {
    Team.findById(req.params.id)
        .populate(['hitters', 'pitchers'])
        .then(team => res.json(team))
        .catch(e => {
            console.log(e);
            return res.status(404).json({
                success: false
            });
        });
});

router.post('/', (req, res) => {
    const team = new Team({
        name: req.body.name,
        contacts: req.body.players || []
    });

    team.save().then(team => res.json(team));
});

router.put('/:id', (req, res) => {
    Team.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (error, document) => {
        if (error) {
            return res.send(500, { error });
        }
        return res.send(document);
    });
});

router.delete('/:id', (req, res) => {
    Team.findById(req.params.id)
        .then(team => team.remove().then(() => res.json({
            success: true
        })))
        .catch(() => res.status(404).json({ success: false }));
});

module.exports = router;
