var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');

class Processor {
    /*
     * object build so you dont have to have a callback for progress and you can do 
     * Processor.progress to get the progress
     */

    constructor(videoPath, outputFol){
        this.videoPath = videoPath;
        this.progress = 0;
        this.outputFolder = outputFol;
    }

    processVideo(callback){
        process(this.videoPath, this.outputFolder, null, (prog)=>{
            this.progress = prog;
        }, ()=>{
            callback();
        })
    }
}

function getThumbnail(file_path, out_path, time, callback){
    time = time || '00:00:00.000';
    let out_folder = out_path.split("/").splice(0, out_path.split("/").length - 1).join("/") + "/"
    ffmpeg(file_path)
        .on('end', ()=>{
            callback();
        })
        .on('err', (err)=>{
            callback(err);
        })
        .screenshot({
            count:1,
            folder: out_folder,
            filename:"thumb.png"
        })
}

function process(file_path, file_output_folder, segment_length, progress_function, callback){
    var video = ffmpeg(file_path);
    segment_length = segment_length || 4;
    
    var progress = {
        progresses: [],
        progress:0
    }

    var qualities = [
        '144',
        '240',
        '360',
        '480',
        '720',
        '1080',
        '1440'
    ]

    video.ffprobe(function (err, metadata) {
        if(err){
            callback(err);
        }else{
            for(let i in qualities){
                if (qualities[i] <= metadata.streams[0].height){
                    //console.log(`?x${qualities[i]}`);

                    let segment_dir = `${file_output_folder}/${qualities[i]}/`;

                    if (!fs.existsSync(segment_dir)) {
                        fs.mkdirSync(segment_dir);
                    }

                    let process_id = -1;

                    video.clone()
                        .size(`?x${qualities[i]}`)
                        .output(`${segment_dir}%3d.mp4`)
                        .addOutputOption("-f", "segment", "-segment_time", segment_length)
                        .on('start', ()=>{
                            process_id = progress.progresses.length;
                            progress.progresses.push(-1);
                        })
                        .on('progress', (prog)=>{
                            progress.progresses[process_id] = prog.percent;
                            progress.progress = progress.progresses.reduce((a, b) => a + b) / progress.progresses.length;
                            if (progress.progress < 0){
                                progress.progress = 0;
                            }
                            progress_function(progress.progress);
                        })
                        .on('end',()=>{
                            progress.progresses[process_id] = 100;
                            //console.log(`process (${process_id}) ended`);
                            let end = true;
                            for(let j in progress.progresses){
                                if(progress.progresses[j] != 100){
                                    end = false;
                                }
                            }
                            if(end){
                                callback();
                            }
                        })
                        .on('err',(err)=>{
                            progress.progresses[process_id] = 100;
                            callback(err);
                        })
                        .run();
                }
            }
        }
    });
}

module.exports = {
    process,
    progress_object: Processor,
    getThumbnail
}