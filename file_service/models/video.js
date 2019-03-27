var { MissingData } = require('../utils/errors.js');
var getUuid = require('uuid');
var fs = require('fs');
var VideoProcessor = require('../utils/video-processor2.js');

module.exports = class Video{
    constructor(title, description, createdAt, data, thumbnail, tempFolder, callback){
        this.uuid = getUuid();
        this.title = propertyExists(title, "title");
        this.description = propertyExists(description, "description");
        this.createdAt = createdAt || new Date();
        this.data = propertyExists(data, "data");
        this.thumbnail = thumbnail || createThumbnail(data);
        this.tempFolder = tempFolder || "temp";
        this.segmentFolder;

        fs.writeFile(`${this.tempFolder}/${this.uuid}`,this.data, (err)=>{
            if (err) throw err
            console.log('tempFile created');
            fs.writeFile(`${this.tempFolder}/${this.uuid}_th`, this.thumbnail, ()=>{
                if (err) throw err
                console.log('tempThumb created');
                callback(this.removeTemp);
            });
        });
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

    segmentVideo(path, callback, progress, frequency){
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        frequency = frequency || 1000;
        this.segmentFolder = path;
        let segmentator = new VideoProcessor.progress_object(`${this.tempFolder}/${this.uuid}`, path);
        segmentator.processVideo(()=>{
            callback();
        });
        setInterval(() => {
            progress(segmentator.progress);
        }, frequency);
        
    }
    
}

function createThumbnail(video){
    //TODO, creates thumbnail from video
    return video
}

function propertyExists(x, name) {
    if (!x) {
        throw new MissingData(name);
    } else {
        return x;
    }
}