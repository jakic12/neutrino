var { Video, getVideoFromDb } = require("../models/video.js");
var mysql = require("mysql");
var config = require("../config.js");
var fs = require("fs");
config.mysql_creds.database = "neutrino_video";

var con = mysql.createConnection(config.mysql_creds);

function removeFolder(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, async (err, files) => {
            if (err) reject(err);
            if (files && files.length > 0) {
                for (i in files) {
                    if (path.endsWith("/") || path.endsWith("\\")) {
                        var newPath = `${path}${files[i]}`;
                    } else {
                        var newPath = `${path}/${files[i]}`;
                    }
                    let stat = fs.lstatSync(newPath);
                    if (stat.isDirectory()) {
                        await removeFolder(newPath);
                    } else {
                        fs.unlinkSync(newPath);
                    }
                }
            }
            fs.rmdir(path, (err) => {
                if (err) reject(err);
                resolve();
            });

        });
    })

}

async function removeVideoFiles(video, callback) {
    await removeFolder(video.segmentFolder);
    callback();
}

function addVideo(title, description, video_buffer, thumbnail_buffer, progress, frequency){
    return new Promise((resolve, reject) => {
        var video1 = new Video(title, description, null, video_buffer, thumbnail_buffer, config.tempFolder, config.videoSegmentFolder, () => {
            video1.segmentVideo(() => {
                video1.writeMetadataToDatabase((result) => {
                    resolve(video1.uuid);
                });
            }, progress, frequency);
        });
    });
}

function removeVideo(uuid){
    return new Promise(async (resolve, reject) => {
        var video = await getVideoFromDb(uuid);
        removeVideoFiles(video, () => {
            con.query("DELETE FROM video WHERE uuid = ?", [video.uuid], (err, result) => {
                if(err) reject(err);
                resolve();
            });
        });
    })
}

function getMetadata(){

}

module.exports = {
    addVideo,
    removeVideo
}