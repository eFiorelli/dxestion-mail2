const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // Validar type
    let validTypes = ['products', 'users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                meesage: 'Allowed types: ' + validTypes.join(', ')
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.file;

    // Extensiones permitidas
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    let shortedName = file.name.split('.');
    let extension = shortedName[shortedName.length - 1];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                meesage: 'Allowed extensions: ' + validExtensions.join(', ')
            }
        });
    }

    // Cambiar nombre al archivo
    let filename = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${ type }/${ filename }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (type === 'users') {
            userImage(id, res, filename);
        }
        if (type === 'products') {
            productImage(id, res, filename);
        }
    });
});


function userImage(id, res, filename) {
    Usuario.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(filename, 'users');
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!userDB) {
            deleteFile(filename, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User does not exists'
                }
            });
        }

        deleteFile(userDB.img, 'users')

        userDB.img = filename;
        userDB.save((err, savedUser) => {
            res.json({
                ok: true,
                usuario: savedUser,
                img: filename
            });
        });
    });
}


function productImage(id, res, filename) {
    Producto.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(filename, 'products');
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productDB) {
            deleteFile(filename, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product does not exists'
                }
            });
        }

        deleteFile(productDB.img, 'products')

        productDB.img = filename;
        productDB.save((err, savedProduct) => {
            res.json({
                ok: true,
                producto: savedProduct,
                img: filename
            });
        });
    });
}


function deleteFile(imageName, type) {
    let imagePath = path.resolve(__dirname, `../../uploads/${ type }/${ imageName }`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}


module.exports = app;