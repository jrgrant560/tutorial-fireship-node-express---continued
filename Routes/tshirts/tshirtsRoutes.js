const express = require('express');
const fs = require('fs');
const router = express.Router();

// dbTshirts Connection
let dbTshirts = JSON.parse(fs.readFileSync('dbTshirts.json'));

function refreshDbTshirts() {
    dbTshirts = JSON.parse(fs.readFileSync('dbTshirts.json'));
    console.log('dbTshirts refreshed');
};

// GET All tshirts
router.get('/', (req, res) => {
    res.status(200).send(dbTshirts);
});

// GET tshirt by id
router.get('/:id', (req, res) => {

    // the id is contained in the url
    const id = parseInt(req.params.id);

    const shirt = dbTshirts.find((shirt) => shirt.id === id);

    if (shirt) {
        res.status(200).send(shirt);
    } else {
        res.status(404).send({ message: `No shirt found with the ID ${id}` });
    }
});

// POST new tshirt
router.post('/new', (req, res) => {

    // the new tshirt data is contained in the request body
    const newTshirt = req.body;
    const newId = newTshirt.id;

    // check if the id is already in use
    const existingTshirt = dbTshirts.find((tshirt) => tshirt.id === newId);
    if (existingTshirt) {
        return res.status(400).send({ message: `ID ${newId} is already in use` });
    }

    // Validation function
    function isValidTshirt(tshirt) {
        // Check if all required properties are included
        return ((Object.keys(tshirt).length === 4) && ('id' in tshirt && 'tshirtname' in tshirt && 'logo' in tshirt && 'size' in tshirt));
    }

    // check if the new tshirt data matches the format in dbTshirts
    const isValidFormat = isValidTshirt(newTshirt);
    if (!isValidFormat) {
        return res.status(400).send({ message: 'Invalid tshirt data format' });
    }

    // add the new tshirt to the database
    dbTshirts.push({ id: newId, ...newTshirt });

    // write the changes to dbTshirts after pushing
    fs.writeFile('dbTshirts.json', JSON.stringify(dbTshirts, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error writing to dbTshirts.json' });
        }
    });

    // send a success response
    res.status(201).send({ message: `New tshirt added with the ID ${newId}` });
});

// PATCH tshirt object (update partially, with specified properties)
router.patch('/update/:id', (req, res) => {
    // the id is contained in the url
    const id = parseInt(req.params.id);

    // the updated properties are contained in the body; if not included, the value will be undefined
    const { tshirtname, logo, size } = req.body;

    // check if the id is available
    const existingTshirt = dbTshirts.find((tshirt) => tshirt.id === id);
    if (!existingTshirt) {
        return res.status(400).send({ message: `Tshirt with ID ${id} does not exist in database` });
    }

    // error response if no valid properties are included in the request
    if (!tshirtname && !logo && !size) {
        res.status(400).send({ message: 'There are no applicable properties to update!' });
    }

    const updatedTshirt = existingTshirt;

    // update the tshirt object with the new properties
    if (tshirtname) {
        updatedTshirt.tshirtname = tshirtname;
    }
    if (logo) {
        updatedTshirt.logo = logo;
    }
    if (size) {
        updatedTshirt.size = size;
    }

    dbTshirts[id] = updatedTshirt;

    // write the changes to dbTshirts.json after updating
    fs.writeFile('dbTshirts.json', JSON.stringify(dbTshirts, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error writing to dbTshirts.json' });
        }
    });

    res.send({
        message: `The tshirt with ID ${id} has been updated...`,
    });
});

// DELETE tshirt object
router.delete('/delete/:id', (req, res) => {

    refreshDbTshirts();

    // the id is contained in the url
    const id = parseInt(req.params.id);

    // check if the id is available
    const existingTshirt = dbTshirts.find((tshirt) => tshirt.id === id);
    if (!existingTshirt) {
        return res.status(400).send({ message: `Tshirt with ID ${id} does not exist in database` });
    }

    // find the index of the tshirt in the database
    const index = dbTshirts.findIndex((tshirt) => tshirt.id === id);
    if (index === -1) {
        return res.status(400).send({ message: `Tshirt with ID ${id} does not exist in database` });
    }

    // remove the tshirt from the database
    dbTshirts.splice(index, 1);

    // write the changes to dbTshirts after deleting
    fs.writeFile('dbTshirts.json', JSON.stringify(dbTshirts, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error writing to dbTshirts.json' });
        }
    });

    res.send({
        message: `The tshirt with ID ${id} has been deleted...`,
    });
});

module.exports = router