require("dotenv").config();
const dns = require("dns");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

const urls = [];

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const { url } = req.body;
  const host = new URL(url).hostname;

  dns.lookup(host, function (err) {
    if (err) {
      console.log(err);
      console.log("hey Jon");
      res.send({ error: "invalid url" });
      return;
    }
    console.log("ytooo");
    const shortUrl = urls.length;
    urls.push({ short_url: shortUrl, original_url: url });
    console.log(urls);

    res.send({ original_url: url, short_url: shortUrl });
  });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const { short_url } = req.params;

  const url = urls.find((url) => url.short_url.toString() === short_url);

  res.redirect(url.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
