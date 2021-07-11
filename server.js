const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
const ShortUrl = require("./models/shortUrl");
const authRoutes = require("./Routes/authRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");
// dotenv is for to safe your secrets
const dotenv = require("dotenv");
const shortid = require("shortid");
const app = express();

dotenv.config({ path: "config.env" });
// Database Connect
connectDB();

// Security
app.use(cors());

//middleware
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const baseUrl = process.env.baseUrl;
app.use("/js", express.static(path.resolve(__dirname, "./public/js")));
app.use("/css", express.static(path.resolve(__dirname, "./public/css")));
app.use("/img", express.static(path.resolve(__dirname, "./public/images")));

app.use((req, res, next) => {
  req.baseUrl = `${req.protocol}://${req.get("host")}`;
  next();
});

app.get("*", checkUser);
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/abc", requireAuth, async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("table", { shortUrls: shortUrls });
});
//create
app.post("/", async (req, res) => {
  try {
    const code = shortid.generate();

    const { fullUrl } = req.body;

    const urlExists = await ShortUrl.findOne({ full: fullUrl });

    if (urlExists) {
      res.render("home", {
        short_url: urlExists.short,
        fullUrl: urlExists.full,
      });
      return;
    }

    const shortUrl = await ShortUrl.create({
      full: req.body.fullUrl,
      short: `${req.baseUrl}/${code}`,
    });

    res.render("home", {
      short_url: shortUrl.short,
      fullUrl: shortUrl.full,
    });
  } catch (err) {
    console.log(err);
  }
});

//this is auth routes
app.use(authRoutes);

//in Archive there is one search option by full short url

//api for search
app.post("/search", (req, res) => {
  var regex = new RegExp(req.body.url, "i");
  //search using full or short url
  ShortUrl.find({
    $or: [{ full: { $regex: regex } }, { short: { $regex: regex } }],
  }).then((data) => {
    res.render("table", { data: data });
  });
});

//map original link to shorter one.
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({
    short: `${req.baseUrl}/${req.params.shortUrl}`,
  });
  if (shortUrl === null) return res.render("error");

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

//error page no match
app.get("*", (req, res) => {
  res.render("error");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`app listening on port 5000...`);
});
