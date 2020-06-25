const express = require("express");
const app = express();

app.use(express.static("public"));

// this info would be coming from the database!!
let cities = [
    {
        name: "Berlin",
        country: "DE",
    },
    {
        name: "Quito",
        country: "Ecuador",
    },
    {
        name: "Tel Aviv",
        country: "Israel",
    },
];

app.get("/cities", (req, res) => {
    // console.log('/cities route has been hit!!');
    res.json(cities);
});

app.listen(8080, () => console.log("IB server is listening...."));
