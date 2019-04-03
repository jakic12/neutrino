var { MissingData, InternalVideoProcessingError, DatabaseError, QueryDatabaseError, ConnDatabaseError } = require('../utils/errors.js');
var getUuid = require('uuid');
var fs = require('fs');
var VideoProcessor = require('../utils/video-processor2.js');
var mysql = require('mysql');
var config = require("../config.js");
config.mysql_creds.database = "neutrino_video";

var con = mysql.createConnection(config.mysql_creds);

module.exports.Video = class Video{
    constructor(title, description, createdAt, data, thumbnail, tempFolder, segmentFolder, callback, uuid){
        this.uuid = uuid || getUuid();
        this.title = propertyExists(title, "title");
        this.description = propertyExists(description, "description");
        this.createdAt = createdAt || new Date();
        this.data = data;
        this.tempFolder = tempFolder || "temp";
        this.segmentFolder = segmentFolder || "tests/test_files/test_output/";
        if(!this.segmentFolder.includes(this.uuid))
            this.segmentFolder += this.uuid + "/";
        this.thumbnail = thumbnail;
        this.thumbnailPath = `${this.segmentFolder}thumb.png`;
        
        if(this.data){
            this.writeTemp(() => {
                console.log("temp writing done");
                this.saveThumbnail(thumbnail, () => {
                    console.log("thumbnail saved");
                    if(callback) callback(this);
                });
            });
        }else{
            if(callback) callback(this);
        }
    }

    serialize(){
        return {uuid:this.uuid, title:this.title, description:this.description, createdAt:this.createdAt, data:this.data, segmentFolder:this.segmentFolder, thumbnailPath:this.thumbnailPath};
    }

    writeMetadataToDatabase(callback){
        con.connect((err) => {
            if (err) throw ConnDatabaseError(err);
            con.query("INSERT INTO `video`(`uuid`, `title`, `desc`, `createdAt`, `segmentFolder`, `thumbnailPath`) VALUES (?,?,?,?,?,?)", [this.uuid, this.title, this.description, this.createdAt, this.segmentFolder, this.thumbnailPath], (err, result) => {
                if(err) throw QueryDatabaseError(err);
                callback(result);
            });
        })
    }

    writeTemp(callback){
        fs.writeFile(`${this.tempFolder}/${this.uuid}`, this.data, (err) => {
            if (err) throw err
            console.log('tempFile created');
            if(this.thumbnail){
                fs.writeFile(`${this.tempFolder}/${this.uuid}_th`, this.thumbnail, () => {
                    if (err) throw err
                    console.log('tempThumb created');
                    callback();
                });
            }else{
                callback();
            }
        });
    }
    
    saveThumbnail(thumbnail,callback){
        let tempThumbnailPath = `./${this.tempFolder}/${this.uuid}_th`;
        let tempVideoPath = `${this.tempFolder}/${this.uuid}`;
        let destFolder = this.thumbnailPath.split("/").slice(0, this.thumbnailPath.split("/").length - 1).join("/") + "/";
        if(thumbnail){
            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder);
            }
            fs.copyFile(tempThumbnailPath, this.thumbnailPath, (err) => {
                if (err) throw new InternalVideoProcessingError(tempThumbnailPath, err);
                callback();
            });
        }else{
            VideoProcessor.getThumbnail(tempVideoPath, this.thumbnailPath, null, err => {
                if (err) {
                    throw InternalVideoProcessingError(tempVideoPath);
                } else {
                    callback();
                }
            });
        }
        
    }

    removeTemp(callback){
        fs.unlink(`${this.tempFolder}/${this.uuid}`,(err) => {
            if(err){
                throw Error('error deleting to file: ' + err);
            }
            fs.unlink(`${this.tempFolder}/${this.uuid}_th`,() => {
                if (err) {
                    throw Error('error deleting to file: ' + err);
                }
                callback();
            });
        });
    }

    segmentVideo(callback, progress, frequency){
        if (!fs.existsSync(this.segmentFolder)) {
            fs.mkdirSync(this.segmentFolder);
        }

        frequency = frequency || 1000;
        let segmentator = new VideoProcessor.progress_object(`${this.tempFolder}/${this.uuid}`, this.segmentFolder);
        segmentator.processVideo(()=>{
            clearInterval(progressInterval);
            callback();
        });
        if(progress){
            var progressInterval = setInterval(() => {
                progress(segmentator.progress);
            }, frequency);
        }
        
    }
    
}

module.exports.getVideoFromDb = (uuid) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM video WHERE uuid = ?", [uuid], (err, result) => {
            if (err) reject(err);
            result = result[0];
            console.log(result);
            var thumbnail = fs.readFileSync(result.thumbnailPath);
            new module.exports.Video(result.title, result.desc, new Date(result.createdAt), null, thumbnail, null, result.segmentFolder, resolve, uuid);
        });
    });
    
}

function propertyExists(x, name) {
    if (!x) {
        throw new MissingData(name);
    } else {
        return x;
    }
}