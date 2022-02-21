const jwt = require("jsonwebtoken");
require("dotenv").config();
let token_key = process.env.TOKEN_KEY;

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, token_key);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
