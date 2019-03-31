var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();
var { Video } = require('../models/video.js');
var { MissingData, FileWritingError } = require('../utils/errors.js');
var mysql = require("mysql");
var fs = require('fs');
var video_manager = require("../utils/video-manager.js");

var testVideo = "D:\\projects\\neutrino\\file_service\\tests\\test_files\\SampleVideo_1280x720_5mb.mp4";
var testThumbnail = "D:\\projects\\neutrino\\file_service\\tests\\test_files\\thumbnail.png";

var deleteOutput = true;

function fileExists(path,callback){
    fs.readFile(path, (err, data) => {
        if (err) {
            throw Error(`internal test error, file ${path} can not be oppened: ${err}`)
        }else if(data){
            callback(true);
        }else{
            console.log("file may be empty or doesnt exist");
            callback(false);
        }
    });
}

function removeFolder(path){
    return new Promise((resolve, reject) =>{
        fs.readdir(path, async (err, files) => {
            if(err) reject(err);
            if(files && files.length > 0){
                for (i in files) {
                    if (path.endsWith("/") || path.endsWith("\\")){
                        var newPath = `${path}${files[i]}`;
                    }else{
                        var newPath = `${path}/${files[i]}`;
                    }
                    let stat = fs.lstatSync(newPath);
                    if (stat.isDirectory()) {
                        await removeFolder(newPath);
                    }else{
                        fs.unlinkSync(newPath);
                    }
                }
            }
            fs.rmdir(path, (err) => {
                if(err) reject(err);
                resolve();
            });
            
        });
    })
    
}

async function removeVideoFiles(video, callback){
    await removeFolder(video.segmentFolder);
    callback();
}
async function removeAllFromDir(path){
    return new Promise((resolve,reject) => {
        fs.readdir(path, async (err, files) => {
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

            resolve();
        });
    })
}

after(async () => {
    if (deleteOutput) {
        console.log("cleare ./tests/test_files/test_output");
        await removeAllFromDir("./tests/test_files/test_output");
    }
});

var VideoProcessor = require('../utils/video-processor2.js');
var video_to_destroy;
afterEach(function (done) {
    this.timeout(20000);
    if (video_to_destroy) {
        console.log("destroyed a video");
        video_to_destroy.removeTemp(() => {
            video_to_destroy = null
            done();
        });
    } else {
        done();
    }
});


describe('video object', () => {
    var video_to_destroy;
    afterEach(function (done) {
        this.timeout(20000);
        if (video_to_destroy) {
            console.log("destroyed a video");
            video_to_destroy.removeTemp(() => {
                video_to_destroy = null
                done();
            });
        } else {
            done();
        }
    });

    context("without arguments", () => {
        it('empty video should throw missing data error', () => {
            expect(() => { var video1 = new Video(); }).to.throw(MissingData);
        });
    });

    it('video creation works', () => {
        var test_video = fs.readFileSync(testVideo);
        var video1 = new Video("test video", "test desc", null, test_video, null, null, null, () => {
            expect(video1).to.be.an.instanceof(Video, "video instance is created");
        });
        video_to_destroy = video1;
    }).timeout(20000);

    it('video creates temp files', (done) => {
        var test_video = fs.readFileSync(testVideo);
        var test_thumb = fs.readFileSync(testThumbnail);
        var video1 = new Video("test video", "test desc", null, test_video, test_thumb, null, null, () => {
            expect(video1).to.be.an.instanceof(Video, "video instance is created");

            fs.readFile(`temp/${video1.uuid}`, (err, data) => {
                if (err) {
                    throw Error(`internal test error, file temp/${video1.uuid} can not be oppened: ${err}`)
                }
                if (data) {
                    fs.readFile(`temp/${video1.uuid}_th`, (err, data) => {
                        if (err) {
                            throw Error(`internal test error, file temp/${video1.uuid}_th can not be oppened: ${err}`)
                        }
                        should.exist(test_video, "temp thumbnail and video is created");
                        done();
                    });
                } else {
                    assert.fail("temp video file doesnt exist");
                }
            });
            video_to_destroy = video1;
        });
    }).timeout(20000);

    it('video deletes thumbnail temp files', (done) => {
        var test_video = fs.readFile(testVideo, (err, data) => {
            var video1 = new Video("test video", "test desc", null, data, null, null, null, () => {
                video1.removeTemp(() => {
                    expect(fs.existsSync(`temp/${video1.uuid}_th`)).to.equal(false, "temp thumbnail should be deleted");
                    done();
                });
            });
        });
    }).timeout(20000);

    it('video deletes video temp files', (done) => {
        var test_video = fs.readFile(testVideo, (err, data) => {
            var video1 = new Video("test video", "test desc", null, data, null, null, null, () => {
                video1.removeTemp(() => {
                    expect(fs.existsSync(`temp/${video1.uuid}`)).to.equal(false, "temp thumbnail should be deleted");
                    done();
                });
            });
        });
    }).timeout(20000);

}).timeout(0);

describe('video processor', () => {
    it('thumbnail is created', (done) =>{
        var test_video = fs.readFile(testVideo, (err, data) => {
            var video1 = new Video("test video", "test desc", null, data, null, null, `./tests/test_files/test_output/`, () => {
                fileExists(`./tests/test_files/test_output/${video1.uuid}/thumb.png` ,result =>{
                    expect(result).to.equal(true);
                    done();
                })
            });
            video_to_destroy = video1;
        });

    }).timeout(0);

    it('segment video', (done) => {
        var test_video = fs.readFile(testVideo, (err, data)=>{
            var video1 = new Video("test video", "test desc", null, data, null, null, `./tests/test_files/test_output/`, () => {
                video1.segmentVideo((err) => {
                    if (err) {
                        console.log(err);
                        throw new Error("test video failed segmenting!");
                    }

                    fs.readFile(`${video1.segmentFolder}/144/000.mp4`, (err, data) => {
                        if (err) {
                            throw Error(`internal test error, file ${testVideo} can not be oppened: ${err}`);
                        }
                        should.exist(data, "last segment 144/000.mp4 is created");
                        done();
                    });

                }, console.log,1000);

                /*VideoProcessor.process(`${video1.tempFolder}/${video1.uuid}`, "./tests/test_files/test_output", null, console.log, (err) => {
                    if (err) {
                        console.log(err);
                        throw new Error("test video failed segmenting!");
                    }

                    fs.readFile(testVideo, (err, data) => {
                        if (err) {
                            throw Error(`internal test error, file ${testVideo} can not be oppened: ${err}`);
                        }
                        should.exist(data, "last segment 144/000.mp4 is created");
                        done();
                    });

                });*/

            });
            video_to_destroy = video1;
        });
    }).timeout(0);

    it('video metadata gets writen to db', (done) => {
        var test_video = fs.readFileSync(testVideo);
        var test_thumb = fs.readFileSync(testThumbnail);
        var video1 = new Video("test video", "test desc", null, test_video, test_thumb, null, `./tests/test_files/test_output/`, () => {
            video1.segmentVideo(() => {
                video1.writeMetadataToDatabase((result) => {
                    result.affectedRows.should.equal(1);
                    done();
                });
            }, console.log);
            video_to_destroy = video1;
        });
    }).timeout(0);

    //it("remove folder works", async ()=> {
    //    await removeFolder("./test_delete");
    //}).timeout(5000);
});

describe('video manager', () => {
    var working_video_id;
    it("add video", async () => {
        var test_video = fs.readFileSync(testVideo);
        working_video_id = await video_manager.addVideo("test video", "this is a test description", test_video);
    }).timeout(0);

    it("remove video", () => {
        return new Promise(async (resolve) => {
            var video = await video_manager.removeVideo("37f2ba49-281a-4cdf-a4e1-f61fcf466e71");
            console.log(video.serialize());
            resolve();
        });
        
    }).timeout(10000);
});