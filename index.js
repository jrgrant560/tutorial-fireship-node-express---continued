const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;

// Read the contents of db.json
const dbData = fs.readFileSync('db.json');
const db = JSON.parse(dbData);

// middleware
// every request will pass through this middleware, being parsed into json
app.use(express.json());



//POST import
const postTshirt = require('./postTshirt');
postTshirt(app);



// starts the api on a specified port (PORT)
app.listen(
    PORT,


    () => console.log(`Server running on http://localhost:${PORT}`)
);


// GET '/tshirt'
// req is the request object
// res is the response object
app.get('/tshirt', (req, res) => {
    res.status(200).send(db);
});

// GET '/tshirt/:id'
app.get('/tshirt/:id', (req, res) => {

    // the id is contained in the url
    const id = parseInt(req.params.id);

    const shirt = db.find((shirt) => shirt.id === id);

    if (shirt) {
        res.status(200).send(shirt);
    } else {
        res.status(404).send({ message: `No shirt found with the ID ${id}` });
    }
});

// Validation function
function isValidTshirt(tshirt) {
    // Check if all required properties are included
    return ((Object.keys(tshirt).length === 4) && ('id' in tshirt && 'tshirtname' in tshirt && 'logo' in tshirt && 'size' in tshirt));
}







// PATCH tshirt object
app.patch('/tshirt/:id', (req, res) => {
    // the id is contained in the url
    const id = parseInt(req.params.id);

    // the updated properties are contained in the body; if not included, the value will be undefined
    const { tshirtname, logo, size } = req.body;

    // check if the id is available
    const existingTshirt = db.find((tshirt) => tshirt.id === id);
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

    db[id] = updatedTshirt;

    // write the changes to db.json after updating
    fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error writing to db.json' });
        }
    });

    res.send({
        message: `The tshirt with ID ${id} has been updated...`,
    });
});


// DELETE tshirt object
app.delete('/tshirt/:id', (req, res) => {
    // the id is contained in the url
    const id = parseInt(req.params.id);

    // check if the id is available
    const existingTshirt = db.find((tshirt) => tshirt.id === id);
    if (!existingTshirt) {
        return res.status(400).send({ message: `Tshirt with ID ${id} does not exist in database` });
    }

    // remove the tshirt from the database
    db.splice(id, 1);

    // write the changes to db.json after deleting
    fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error writing to db.json' });
        }
    });

    res.send({
        message: `The tshirt with ID ${id} has been deleted...`,
    });
});
