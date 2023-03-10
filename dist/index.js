"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosResolutions = void 0;
const db_1 = require("./db/db");
const validatorVideos_1 = require("./middlewares/validatorVideos");
const express = require('express');
const app = express();
const port = process.env.PORT || 666;
//const parserMiddleware = bodyParser.text({})
//app.use(parserMiddleware)
app.use(express.json());
exports.videosResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080"];
//get all
app.get('/videos', (req, res) => {
    res.send(db_1.vidosDB);
});
//get by ID
app.get('/videos/:id', (req, res) => {
    let videos = db_1.vidosDB.find(v => v.id === +req.params.id);
    if (videos) {
        res.status(200).send(videos);
    }
    else {
        res.sendStatus(404);
    }
});
//post video
app.post('/videos', validatorVideos_1.videosValidator, validatorVideos_1.inputValidationMiddleware, (req, res) => {
    const now = new Date();
    const nextdate = new Date();
    nextdate.setDate(now.getDate() + 1);
    let newVideos = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded || false,
        minAgeRestriction: req.body.minAgeRestriction,
        createdAt: now.toISOString(),
        publicationDate: nextdate.toISOString(),
        availableResolutions: req.body.availableResolutions || exports.videosResolutions,
    };
    db_1.vidosDB.push(newVideos);
    res.status(201).send(newVideos);
});
//update videos
app.put('/videos/:id', validatorVideos_1.videosValidator, validatorVideos_1.inputValidationMiddleware, (req, res) => {
    let isUpdated = db_1.vidosDB.find(v => v.id === +req.params.id);
    if (isUpdated) {
        isUpdated.title = req.body.title;
        isUpdated.author = req.body.author;
        isUpdated.canBeDownloaded = req.body.canBeDownloaded;
        isUpdated.minAgeRestriction = req.body.minAgeRestriction;
        isUpdated.publicationDate = req.body.publicationDate;
        isUpdated.availableResolutions = req.body.availableResolutions;
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
//delete all
app.delete('/testing/all-data', (req, res) => {
    db_1.vidosDB.splice(0, db_1.vidosDB.length);
    res.sendStatus(204);
});
//delete by ID
app.delete('videos/:id', (req, res) => {
    for (let i = 0; i < db_1.vidosDB.length; i++) {
        if (db_1.vidosDB[i].id === +req.params.id) {
            db_1.vidosDB.splice(i, 1);
            res.send(204);
            return;
        }
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
