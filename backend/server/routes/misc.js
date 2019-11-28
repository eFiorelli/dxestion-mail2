const express = require('express');
let { checkUserToken } = require('../middlewares/authentication');
const Client = require('../models/client');

let app = express();

// Mostrar todas las categorías
app.get('/test', checkUserToken, (req, res) => {
    Client.find({
        user: req.user
    }, (err, response) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Failed on retrieving clients',
                err: err
            });
        }

        if (response) {
            return res.status(200).json({
                ok: true,
                data: response
            });
        }
    });
});


module.exports = app;