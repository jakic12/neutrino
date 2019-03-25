var { MissingData } = require('../utils/errors.js');
var getUuid = require('uuid');
var fs = require('fs');

module.exports = class Video{
    constructor(title, description, createdAt, data, thumbnail, tempFolder, callback){
        this.uuid = getUuid();
        this.title = propertyExists(title, "title");
        this.description = propertyExists(description, "description");
        this.createdAt = createdAt || new Date();
        this.data = propertyExists(data, "data");
        this.thumbnail = thumbnail || createThumbnail(data);
        this.tempFolder = tempFolder || "temp";

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