const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { checkUserToken, checkAdminRole } = require('../middlewares/authentication');
const app = express();


app.get('/users', checkUserToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 0;
    limit = Number(limit);

    User.find({ status: true }, '_id name email role status img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            User.count({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    users: users,
                    count: count
                });
            });
        });
});


app.get('/user/:id', checkUserToken, (req, res) => {

    let id = req.params.id;

    User.findById(id, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        } else {
            res.json({
                ok: true,
                user: userDB,
            });
        }
    });
});


app.post('/user', [checkUserToken, checkAdminRole], function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});


app.put('/user/:id', [checkUserToken, checkAdminRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body.user, ['name', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Unable to update user',
                err: err
            });
        }
        res.json({
            ok: true,
            message: 'User successfully updated',
            user: userDB
        });
    });
});


app.delete('/user/:id', [checkUserToken, checkAdminRole], function (req, res) {
    let id = req.params.id;

    // User.findByIdAndRemove( id, (err, deletedUser)=>{
    // 	if (err){
    // 		return res.status(400).json({
    // 			ok: false,
    // 			err: err
    // 		})
    // 	}
    // 	if (!deletedUser){
    // 		return res.status(400).json({
    // 			ok: false,
    // 			err: {
    // 				message: 'User not found'
    // 			}
    // 		})
    // 	}
    // 	res.json({
    // 		ok: true,
    // 		user: deletedUser
    // 	})
    // })

    let changeStatus = {
        status: false
    };

    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});


module.exports = app;