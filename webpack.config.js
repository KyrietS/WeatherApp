const path = require("path");

module.exports={
    mode: "production",
    entry: "./js/main.js",
    output: {
        filename: "main-min.js",
        path: path.join(__dirname, "/js/")
    },
}