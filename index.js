require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose")
const URL = require("./models/model.url")
const isValidURL = require("./urlValidator")


// Basic Configuration
const port = process.env.PORT || 3000;



app.use(express.urlencoded({extended: false}))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// API endpoint for Post request 
app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url

  if(!isValidURL(url)){
    res.status(404).json({ error: 'invalid url' })
    console.log({error: "invalid url"})
    return;
  }
  try {
    //Return total number of docs in dB
    let numDocs = await URL.countDocuments({})
    

    const createdDoc = await URL.create({original_url: url, short_url: `${numDocs + 1}`})
    const objURL = await URL.findOne(createdDoc).select({_id:0, original_url:1, short_url:1})
    res.status(200).json(objURL)
    console.log(objURL)
    return;
  } catch (err) {
    console.error(err)
  }  
});


// API GET request using <short_url> prop as endpoint  
app.get("/api/shorturl/:id", async (req, res) => {
  try {
    //Cross-referencing short_url param to original_url in dB 
    const shortURL = req.params.id
    const objURL = await URL.findOne({short_url: shortURL})
    console.log(objURL)
    const originalURL = objURL["original_url"]
    console.log(originalURL)

      //Re-directing to site of original_url
      res.status(500).redirect(originalURL)
    

  } catch (error) {
      console.log(error.message)
      res.status(500).json("Can not be found")
  }
  
})




//Server Configuration
const runServer = async() => {
  try {
    const dB = await mongoose.connect(process.env.MONGOOSE_URL)
    console.log("Connected to database")

    app.listen(port, function() {
      console.log(`Listening on port ${port}`);
    })
  } catch (error) {
    console.log(error.message)
  }
}

runServer()



