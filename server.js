'use strict';
const express = require('express');
const app = express();
const data = require('./MovieData/data.json');
const axios = require('axios').default;
require("dotenv").config();




function MovieData(id, title, release_date, poster, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster;
    this.overview = overview;
}

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
let urlSearch =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${search || "The"}&page=2`;

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
    axios.get(`https://api.themoviedb.org/3/movie/latest?api_key=${APIKEY}&language=en-US`)
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
    let newarr=[];
    axios.get(urlSearch)
    .then((result)=>{
        result.data.results.forEach((element) => {
            newarr.push(new MovieData(element.id,element.title,element.release_date,element.poster_path,element.overview))
        })
        res.status(200).json(newarr);
    }).catch((err)=>{
        errorHandler (err, req, res, next);
    })
});


app.use("*", (req, res) =>{
    return res.status(404).send("Page Not Found");

});


// to turn on the server from this 
app.listen(3000, () => {    
    console.log(`Example app listening on port 3000`)
});

