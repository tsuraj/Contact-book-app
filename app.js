const express = require('express');
const app = express();
require('dotenv').config();


console.log(process.env);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
 const contactRoutes = require('./api/routes/contacts');
const { urlencoded } = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use('/contact',contactRoutes);
mongoose.connect('mongodb+srv://suraj:'+process.env.MONGO_ATLAS_PW +'@cluster0.hcj2h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useUnifiedTopology: true,
    useNewUrlParser: true
},()=>console.log("database connected")
); 
console.log(process.env.PORT);
app.listen(port,()=>console.log(`Listing to the ${port}`))

