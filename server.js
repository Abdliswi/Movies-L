
'use strict';
const express = require('express');
const app = express();
const data = require('./MovieData/data.json');
const axios = require('axios');
const pg = require("pg");                                    // adding the pg here 
require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL;              // adding the pg here 
//const client = new pg.Client(DATABASE_URL);                   // adding the DATABASE_URL here 
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false}
});

function MovieData(id, title, release_date, poster, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster;
    this.overview = overview;
}
app.use(express.json());
app.use(function errorHandler (err, req, res, next) {
    let error ={
        status:500,
        err:'Sorry, something went wrong'
    };
    res.status(500).send(error)
  })

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

let urlTr =`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`;

app.get("/popular",(req,res)=>{
    let result = [];
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.APIKEY}&language=en-US&page=1`)
    .then(apiResponse => {
        apiResponse.data.results.map(value => {
            let oneMovei = new Movies(value.id,value.title,value.release_date,value.poster_path, value.overview);
            result.push(oneMovei);
        })
        return res.status(200).json(result);
    }).catch(error => {
        errorHandler(error, req, res);
    })
} );

app.get("/latest", (req,res)=>{
    axios.get(`https://api.themoviedb.org/3/movie/latest?api_key=${process.env.APIKEY}&language=en-US`)
    .then(apiResponse => {
        return res.status(200).json(apiResponse.data);
    }).catch(error => {
        errorHandler(error, req, res);
    })
});


app.get('/trending',(req,res)=>{
    let newarr=[];
    axios.get(urlTr)
    .then((result)=>{
        result.data.results.forEach((element) => {
            newarr.push(new MovieData(element.id,element.title,element.release_date,element.poster_path,element.overview))
        })
        res.status(200).json(newarr);
    }).catch((err)=>{
        errorHandler (err, req, res, next);
    })
});

app.get('/search',(req,res)=>{
    const search = req.query.query
    let newarr=[];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${search || "The"}&page=2`)
    .then((result)=>{
        result.data.results.forEach((element) => {
            newarr.push(new MovieData(element.id,element.title,element.release_date,element.poster_path,element.overview))
        })
        res.status(200).json(newarr);
    }).catch((err)=>{
        errorHandler (err, req, res, next);
    })
});
app.get("/getMovies", (req, res)=>{
    const movie = req.body;
    const sql =`INSERT INTO TheMovieTable(title, release_date, poster_path, overview,comment) VALUES($1, $2, $3, $4, $5) RETURNING *;`;
    const values = [movie.title, movie.release_date,movie.poster_path,movie.overview,movie.comment];
    
    client.query(sql, values).then((result) => {
        return res.status(201).json(result.rows);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
});
app.post("/addMovie", (req, res)=>{
    const sql = `SELECT * FROM TheMovieTable;`;  
    client.query(sql).then((result) => {
    return res.status(200).json(result.rows);
    }).catch((error) => {
    errorHandler(error, req, res);
});
});
app.put('/UPDATE/:id', (req, res)=>{
    const id = req.params.id;
    const movie = req.body;
    const sql = `UPDATE TheMovieTable SET title=$1, release_date=$2,poster_path=$3, overview=$4, comment=$5 WHERE id=$6 RETURNING *`;
    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment, id];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
});
});

app.delete('/DELETE/:id', (req, res)=>{
    const id = req.params.id;
    const sql = `DELETE FROM TheMovieTable WHERE id=$1;`;
    const values = [id];
    client.query(sql, values).then(() => {
        return res.status(204).json({});
    })
    .catch((error) => {
        errorHandler(error, req, res);
});
});
app.get('/getMovie/:id', (req, res)=>{
    const id = req.params.id;
    let sql = `SELECT * FROM TheMovieTable WHERE id=$1;`;
    const values = [id];
    client.query(sql,values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
});
});


app.use("*", (req, res) =>{
    return res.status(404).send("Page Not Found");

});


// to turn on the server from this 
client.connect().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(Listen on ${process.env.PORT});
    });
});

