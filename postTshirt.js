const fs = require('fs');

module.exports = function (app) {

    // POST new tshirt object
    app.post('/tshirt/:id', (req, res) => {

        // the id is contained in the url
        const id = parseInt(req.params.id);

        // the new tshirt data is contained in the request body
        const newTshirt = req.body;
        newTshirt.id = id;

        // check if the id is already in use
        const existingTshirt = db.find((tshirt) => tshirt.id === id);
        if (existingTshirt) {
            return res.status(400).send({ message: `ID ${id} is already in use` });
        }

        // Validation function
        function isValidTshirt(tshirt) {
            // Check if all required properties are included
            return ((Object.keys(tshirt).length === 4) && ('id' in tshirt && 'tshirtname' in tshirt && 'logo' in tshirt && 'size' in tshirt));
        }

        // check if the new tshirt data matches the format in db.json
        const isValidFormat = isValidTshirt(newTshirt);
        if (!isValidFormat) {
            return res.status(400).send({ message: 'Invalid tshirt data format' });
        }

        // add the new tshirt to the database
        db.push({ id: id, ...newTshirt });

        // write the changes to db.json after pushing
        fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error writing to db.json' });
            }
        });

        // send a success response
        res.status(201).send({ message: `New tshirt added with the ID ${id}` });
    });


};