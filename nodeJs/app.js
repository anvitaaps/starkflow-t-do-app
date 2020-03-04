// dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// Connect mongoose to our database
const config = require('./config/database');
mongoose.connect(config.database);

//Initialize our app variable
const app = express();

//Middleware for CORS
app.use(cors());

//Middlewares for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files

*/
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req,res) => {
    res.send("Invalid page");
})

const to_do = require('./controllers/to-do');

//Routing all HTTP requests to /to-do to to_do controller
app.use('/to-do',to_do);

//Declaring Port
const port = 3000;

//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});