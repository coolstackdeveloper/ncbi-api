const axios = require('axios');
const express = require('express');
const converter = require('xml-js');

let app = express();
app.use(express.static('public'))

const ncbiBaseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

let ncbiFetchUrl = `${ncbiBaseUrl}/efetch.fcgi`;
let ncbiSearchUrl = `${ncbiBaseUrl}/esearch.fcgi`;
let ncbiSummaryhUrl = `${ncbiBaseUrl}/esummary.fcgi`;

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get('/', (req, res) => {
    res.send('index.html');
});

app.get('/search', (req, res) => {
    let database = req.query.database;
    let term = req.query.term;
    let maxResultsToReturn = req.query.retmax || 100;

    let url = `${ncbiSearchUrl}?db=${database}&term=${term}}&retmax=${maxResultsToReturn}&retmode=json`;

    axios.get(url).then(response => {
        res.send(response.data);
    });
});

app.get('/summary', (req, res) => {
    let database = req.query.database;
    let id = req.query.id;

    let url = `${ncbiSummaryhUrl}?db=${database}&id=${id}}&retmode=json`;

    axios.get(url).then(response => {
        res.send(response.data);
    });
});

app.get('/fetch', (req, res) => {
    let database = req.query.database;
    let id = req.query.id;

    let url = `${ncbiFetchUrl}?db=${database}&id=${id}}&retmode=xml`;

    axios.get(url).then(response => {
        let jsonResponse = converter.xml2json(response.data, {
            compact: true,
            spaces: 4
        });
        res.send(jsonResponse);
    });
});


let port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server started at port ${port}`));