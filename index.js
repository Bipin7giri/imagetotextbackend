const express = require("express");
// dotenv.config();

// const dotenv = require('dotenv');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const cors = require("cors");
const cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: 'dr54a7gze',
  api_key: '868275163814591',
  api_secret: 'U0-E-H34SF1Dl1vpyroUU361AUQ',
});
const tesseract = require("node-tesseract-ocr");

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use(cors());
// app.use("/api",api)
const http = require("http");

const server = http.createServer(app);

const port = 3000;
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.post(
  "/image",
  upload.single("file_attachment"),
  async function (req, res, next) {
    console.log(req.file);
   const imageUrl =  await cloudinary.uploader
    .upload(req.file.path)

    
    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
    }


    const img = imageUrl?.secure_url

    tesseract
      .recognize(img, config)
      .then((text) => {
    res.send(text);
        console.log("Result:", text)
      })
      .catch((error) => {
        console.log(error.message)
      })


    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  }
);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
