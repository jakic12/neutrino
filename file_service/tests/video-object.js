var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

var Video = require('../models/video.js');
var { MissingData, FileWritingError } = require('../utils/errors.js');
var fs = require('fs');

var testVideo = "D:\\projects\\neutrino\\file_service\\tests\\test_files\\SampleVideo_1280x720_5mb.mp4";
var testThumbnail = "D:\\projects\\neutrino\\file_service\\tests\\test_files\\thumbnail.png";

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

describe('video object', () => {
    var video_to_destroy;
    afterEach(function(done){
        this.timeout(20000);
        if (video_to_destroy){
            console.log("destroyed a video");
            video_to_destroy.removeTemp(() => {
                done();
            });
        }else{
            done();
        }
    });
    context("without arguments", ()=>{
        it('empty video should throw missing data error', () => {
            expect(()=>{ var video1 = new Video(); }).to.throw(MissingData);
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
                if (data){
                    fs.readFile(`temp/${video1.uuid}_th`, (err, data) => {
                        if (err) {
                            throw Error(`internal test error, file temp/${video1.uuid}_th can not be oppened: ${err}`)
                        }
                        should.exist(test_video,"temp thumbnail and video is created");
                        done();
                    });
                }else{
                    assert.fail("temp video file doesnt exist");
                }
            });
            video_to_destroy = video1;
        });
    }).timeout(20000);

    it('video deletes thumbnail temp files', (done) => {
        var test_video = fs.readFile(testVideo, (err, data)=>{
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
    var VideoProcessor = require('../utils/video-processor2.js');
    var video_to_destroy;
    afterEach(function (done) {
        this.timeout(20000);
        if (video_to_destroy) {
            console.log("destroyed a video");
            video_to_destroy.removeTemp(() => {
                done();
            });
        } else {
            done();
        }
    });

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
});