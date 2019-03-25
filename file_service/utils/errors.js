class MissingData extends Error {
    constructor(property){
        super(`Missing property: "${property}"`);
        this.name = "MissingData";
        this.errorCode = 500;
    }
}
class FileWritingError extends Error {
    constructor(path){
        super(`writing the file: "${path}" failed!`);
        this.name = "FileWritingError";
        this.errorCode = 500;
    }
}

module.exports = {
    MissingData,
    FileWritingError
}