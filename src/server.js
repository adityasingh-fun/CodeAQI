const express = require('express');
const bodyParser = require('body-parser');
const aqiModel = require('./models/aqi_inModel');
require('dotenv').config();
// const dotenv = require('dotenv').config();
// const {MONGODB_URI} = process.env;

const route = require('./route/route');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://chaudharyaditya41:Z67gI1uJnrGCnHuY@cluster0.jgngtnq.mongodb.net/testingAPIsDb11?retryWrites=true&w=majority', {
    usenewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.log(err))


app.use('/', route);

// app.get('/',(req,res)=>{
//     res.send("Working")
// })

app.get('/', async (req,res)=>{
    console.log("hello");
    const documents = await aqiModel.find();
    console.log(documents);
    res.render('index',{documents});
})

app.listen(4000, function () {
    console.log('Express app running on Port', 4000)
});
