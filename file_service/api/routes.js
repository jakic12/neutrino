var Video = require('../models/video.js');
const router = require('express').Router();

router.get("/segment/:videoUuid/:index", (req,res) => {
    res.status = 501;
    res.send("route not implemented yet");
});

router.post("/upload", (req,res) => {
    res.status = 501;
    res.send("route not implemented yet");
});