const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();
let token_key = process.env.TOKEN_KEY;

// 1 minutes of lock
const LOCK_TIME = 60 * 1000;
//
async function comparePassword(password, userPassword, res) {
  try {
    const valid = await bcrypt.compare(password, userPassword);

    if (!valid) {
      return res
        .status(401)
        .json({ error: "Mot de passe (ou email) incorrect !" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

function checkPassword(password) {
  const regularExp = RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$");
  if (regularExp.test(password)) {
    console.log("Strong password!");
    return true;
  } else {
    console.log("Weak password!");
    return false;
  }
}

function checkIfAccountIsLocked(userLockUntil) {
  console.log("Dans checkIfAccountIsLock");
  if (userLockUntil && userLockUntil > Date.now()) {
    console.log("check account return true");
    return true;
  } else {
    console.log("check account return false");
    return false;
  }
}

async function incrementLoginAttempt(emailHash, user) {
  console.log("Dans incrementLoginAttempt");
  return await user.update(
    { login_attempts: user.login_attempts + 1 },
    {
      where: { emailHash: emailHash },
    }
  );
}

async function blockUserAccount(emailHash, user) {
  console.log("Dans blockUserAccount");
  return await user.update(
    {
      login_attempts: user.login_attempts + 1,
      lock_until: Date.now() + LOCK_TIME,
    },
    {
      where: {
        emailHash: emailHash,
      },
    }
  );
}

async function resetUserLockAttempt(emailHash, user) {
  console.log("Dans resetUserLockAttempt");
  return await user.update(
    { login_attempts: 0, lock_until: "NULL" },
    {
      where: {
        emailHash: emailHash,
      },
    }
  );
}

//envoie du token dans un cookie
async function sendNewToken(userData, res) {
  newToken = jwt.sign(
    { userId: userData.id, admin: userData.admin },
    token_key,
    {
      expiresIn: "2h",
    }
  );

  return await res
    .status(200)
    // expire dans 2h
    .cookie("token", newToken, { maxAge: 7200000, httpOnly: true })
    .cookie("groupomania", true, { maxAge: 7200000, httpOnly: false })
    .cookie("groupomaniaId", userData.id, { maxAge: 7200000, httpOnly: false })
    .json({
      userId: userData.id,
      token: newToken,
    });
}

function getInfosUserFromToken(req, res) {
  try {
    let userId = -1;
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, token_key);
    let userInfos = {
      userId: decodedToken.userId,
      admin: decodedToken.admin,
    };
    userId = decodedToken.userId;
    if (userId == -1) {
      throw "Invalid user ID";
    } else {
      return userInfos;
    }
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
}

function isAdmin(req, res) {
  try {
    let userId = -1;
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, token_key);
    let isAdmin = decodedToken.admin;
    userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      return isAdmin;
    }
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
}

function eraseCookie(res) {
  return res
    .status(200)
    .cookie("token", "", { expires: new Date(0) })
    .json({
      message: "Utilisateur d??connect??",
    });
}

async function destroyUser(user) {
  return await user.destroy({
    where: { id: user.id },
  });
}

exports.checkPassword = checkPassword;
exports.checkIfAccountIsLocked = checkIfAccountIsLocked;
exports.sendNewToken = sendNewToken;
exports.resetUserLockAttempt = resetUserLockAttempt;
exports.incrementLoginAttempt = incrementLoginAttempt;
exports.blockUserAccount = blockUserAccount;
exports.comparePassword = comparePassword;
exports.getInfosUserFromToken = getInfosUserFromToken;
exports.isAdmin = isAdmin;
exports.eraseCookie = eraseCookie;
exports.destroyUser = destroyUser;
