create database neutrino_video;
use neutrino_video;
create table `video`(
    `uuid` varchar(255) primary key not null,
    `title` varchar(256) not null,
    `desc` text not null,
    `createdAt` datetime,
    `segmentFolder` varchar(256),
    `thumbnailPath` varchar(256),
    `views` int default 0,
    `upvotes` int default 0,
    `downvotes` int default 0
);