'use strict';
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const axios = require('axios').default;
const data = require('./Movie Data/data.json');

dotenv.config();

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

function MovieData(id, title, release_date, poster, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster;
    this.overview = overview;
}

app.get('/', (req, res) => {
    //res.send('Hello World!')
    res.send(new MovieData(
        data.title,
        data.poster_path,
        data.overview
    ));
});

app.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
});

app.get('/trending', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`)
        .then(function (response) {
            // handle success
            let results = [];
            response.data.results.forEach(m => {
                results.push(new MovieData(m.id, m.title, m.release_date, m.poster_path, m.overview));
            });
            res.send(results);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.sendStatus(500).send("error while getting trending movie, error: " + error)
        });
});

app.get('/search', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}=en-US&query=${req.query.q}&page=2`)
        .then(function (response) {
            // handle success
            //console.log(response.data);
            let m = response.data.results[0];
            res.send(new MovieData(m.id, m.title, m.release_date, m.poster_path, m.overview));
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.sendStatus(500).send("error while getting trending movie, error: " + error)
        });
});

app.get('/search_by_id', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/${req.query.id}?api_key=${API_KEY}`)
        .then(function (response) {
            // handle success
            console.log(response.data);
            let m = response.data;
            res.send(new MovieData(m.id, m.title, m.release_date, m.poster_path, m.overview));
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.sendStatus(500).send("error while getting trending movie, error: " + error)
        });
});

app.get('/revnue', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/${req.query.id}?api_key=${API_KEY}`)
        .then(function (response) {
            // handle success
            console.log(response.data);
            let m = response.data;
            res.send(`Revenue: ${m.revenue}$`);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.sendStatus(500).send("error while getting trending movie, error: " + error)
        });
});

app.get('*', (req, res) => {
    res.status(404).send("page not found error 404");
});

// https://expressjs.com/en/guide/error-handling.html
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});


