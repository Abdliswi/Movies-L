'use strict';
const express = require('express');
const app = express();
const data = require('./MovieData/data.json');




function MovieData(id, title, release_date, poster, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster;
    this.overview = overview;
}

app.get('/', (req, res) => {             // to establish a path when client enter link get this func from server 
    let result = [];
    data.data.forEach((value) => {
        let oneMovie = new MovieData(value.title,value.poster_path, value.overview);
        result.push(oneMovie);
    });
    return res.json(result);
});

app.get('/favorite', (req, res) => {        // to establish a path 
    res.send("Welcome to Favorite Page");
    //      res.json("Welcome to Favorite Page"); same to prev one 
});
// to turn on the server from this 
app.listen(3000, () => {    
    console.log(`Example app listening on port 3000`)
});
