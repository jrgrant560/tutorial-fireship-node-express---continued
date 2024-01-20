const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;

// db.json Connection
// const dbData = fs.readFileSync('db.json');
// const db = JSON.parse(dbData);

// IMPORTED ROUTE HANDLERS
// import /birds routes
const birdsRouter = require('./Routes/birds/birds')
// GET ALL import
const tshirtsRouter = require('./Routes/tshirts/tshirtsRoutes');
// POST import
// const postTshirtRouter = require('./postTshirt');


// middleware
// every request will pass through this middleware, being parsed into json
app.use(express.json());
// /birds middleware
app.use('/birds', birdsRouter)


// starts the api on a specified port (PORT)
app.listen(
    PORT,


    () => console.log(`Server running on http://localhost:${PORT}`)
);

app.use('/tshirts', tshirtsRouter);







// ***NOTED FOR LATER: chainable route handlers
// app.route('/book')
//   .get((req, res) => {
//     res.send('Get a random book')
//   })
//   .post((req, res) => {
//     res.send('Add a book')
//   })
//   .put((req, res) => {
//     res.send('Update the book')
//   })