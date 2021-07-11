const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "net ninja secret", (err, decodedtoken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        // console.log(decodedtoken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

//check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedtoken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        // console.log(decodedtoken);
        let user = await User.findById(decodedtoken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
