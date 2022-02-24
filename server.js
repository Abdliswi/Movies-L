const express = require('express');
const data = require('./MovieData/data.json') // path of data
const app = express();
const port = 3000;

function MovieData(title, poster_path, overview,){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
};

app.get('/', (req, res) => { //
    let result = [];
    data.data.forEach((value) => {
        let oneMovie = new MovieData(value.title,value.poster_path, value.overview);
        result.push(oneMovie);
    });
    return res.json(result);
});



app.get('/favorite', (req, res) => {    
    res.json("Welcome to Favorite Page");
//    res.send("Welcome to Favorite Page");

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

