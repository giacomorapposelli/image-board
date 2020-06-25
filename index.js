const express = require("express");
const app = express();
const { addImg } = require("./db");

app.use(express.static("public"));

app.get("/images", (req, res) => {
    addImg()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error: ", err);
        });
});

app.listen(8080, () => console.log("IB server is listening...."));
