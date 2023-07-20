//Express is the package that I will be using to create and route the api's
const express = require('express');

//This uses the file system to help navigate and collect data through different files 
const fs = require('fs');

//Allows us to work with our files and their paths
const path = require('path');

//Local server will be listening on PORT 3001
const PORT = process.env.PORT || 3001;

//Allows us to use express middleware
const app = express();

//Allows us to use this file as a data base to store content
const dataBase = require('./Develop/db/db.json')

//Configuring express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./Develop/public"));

//Generates Unique ID's 
const uniqueId = require('generate-unique-id');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
  });  

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    try {
        const data = fs.readFileSync('./Develop/db/db.json', 'utf8');
        console.log(data);
        res.json(JSON.parse(data));
      } catch (err) {
        console.error(err);
        res.json(err);
      }
});

app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uniqueId()
    }
    dataBase.push(newNote);
    fs.writeFileSync(path.join(__dirname, './Develop/db/db.json'), JSON.stringify(dataBase, null, 2));
    const newData = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf-8'))
  res.json(newData);
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});