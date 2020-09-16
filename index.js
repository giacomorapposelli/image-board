const express = require("express");
const app = express();
const {
    addNewImg,
    addImg,
    getImageInfo,
    getImageComments,
    addComment,
    getMoreImages,
} = require("./db");

app.use(express.static("public"));
app.use(express.json());

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
    const imageUrl = `${s3Url}${req.file.filename}`;
    console.log("imgurl: ", imageUrl);
    if (req.body.username == "") {
        req.body.username = "Anonymous";
    }
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

app.get("/image/:id", (req, res) => {
    getImageInfo(req.params.id)
        .then((result) => {
            console.log(req.params.id);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/comments/:id", (req, res) => {
    getImageComments(req.params.id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/comments", (req, res) => {
    if (req.body.username == "") {
        req.body.username = "Anonymous";
    }
    if (req.body.comment == "") {
        req.body.comment = "Speechless";
    }
    addComment(req.body.imageId, req.body.username, req.body.comment)
        .then(({ rows }) => {
            console.log("comment: ", rows);
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/images/more/:id", (req, res) => {
    getMoreImages(req.params.id).then(({ rows }) => {
        console.log(rows);
        res.json(rows);
    });
});

app.listen(process.env.PORT || 8080, () =>
    console.log("IB server is listening....")
);
