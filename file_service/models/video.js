var { MissingData, InternalVideoProcessingError } = require('../utils/errors.js');
var getUuid = require('uuid');
var fs = require('fs');
var VideoProcessor = require('../utils/video-processor2.js');

module.exports = class Video{
    constructor(title, description, createdAt, data, thumbnail, tempFolder, segmentFolder, callback){
        this.uuid = getUuid();
        this.title = propertyExists(title, "title");
        this.description = propertyExists(description, "description");
        this.createdAt = createdAt || new Date();
        this.data = propertyExists(data, "data");
        this.tempFolder = tempFolder || "temp";
        this.segmentFolder = segmentFolder || "tests/test_files/test_output/";
        this.segmentFolder += this.uuid + "/";
        this.thumbnail = thumbnail;
        this.thumbnailPath = `${this.segmentFolder}thumb.png`;

        
        this.writeTemp(()=>{
            console.log("temp writing done");
            this.saveThumbnail(thumbnail, () => {
                console.log("thumbnail saved");
                callback();
            });
        });
        
        
    }

    writeToDatabase(){
        //TODO
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
        var progressInterval = setInterval(() => {
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