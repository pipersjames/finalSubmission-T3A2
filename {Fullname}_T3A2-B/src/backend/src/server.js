const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// Creating EXPRESS APP
const app = express();


var corsOptions = {
    origin: [
                "http://localhost:3000", "http://localhost:3000/", 
                "https://stream-lined.netlify.app/", "https://stream-lined.netlify.app"
        ],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware to parse JSON body
app.use(express.json());

app.get("/", (request, response) => {
    response.json({
        message: "Welcome to the Stream-Lined API"
    })
});
const userRouter = require('./controllers/UserController');
app.use("/users", userRouter);


// Defining routes for form template creation
const formTemplateRouter = require('./controllers/FormTemplateController');
app.use("/formTemplates", formTemplateRouter)

//defining routes for form Submission
const formRouter = require('./controllers/FormController')
app.use("/forms", formRouter)


module.exports = {
    app
}