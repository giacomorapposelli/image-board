const express = require("express");
const app = express();
const { addNewImg, addImg } = require("./db");

app.use(express.static("public"));

/////BOILERPLATE //////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

/////////////////////////////

app.get("/images", (req, res) => {
    addImg()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("file:", req.file);

    const { filename } = req.file;
    const imageUrl = `${s3Url}${filename}`;
    console.log("imgurl: ", imageUrl);
    addNewImg(
        imageUrl,
        req.body.username,
        req.body.title,
        req.body.description
    ).then(({ rows }) => {
        res.json(rows[0]);
    });
    console.log("input: ", req.body);
});

app.listen(8080, () => console.log("IB server is listening...."));
