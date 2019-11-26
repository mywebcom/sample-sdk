"use strict";

const express = require('express')
const app = express()
const port = 3000
const AGL = require('./src/agl.es6')
const agl = new AGL();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    agl.fetch().then((rs) => {
        let cats = [];
        cats = agl.sortCats(rs);
        res.render('index', {title: 'AGL Test', sortedFemale: cats['female'], sortedMale: cats['male']});
    }).catch((err) => {
        res.render('error');
    })
});

app.listen(port, () => console.log(`AGL app listening on port ${port}!`))

