const bcrypt = require("bcrypt");
const cryptoJS = require("crypto-js");
const functions = require("../utils/functions");
const models = require("../models");

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const MAX_LOGIN_ATTEMPTS = 3;

function incrementLoginAttempt(emailHash, loginAttempts) {
  User.update(
    { login_attempts: loginAttempts.login_attempts + 1 },
    {
      where: { emailHash: emailHash },
    }
  );
}

exports.signup = async (req, res, next) => {
  let name = req.body.name;
  let surname = req.body.surname;
  let password = req.body.password;

  // Hash email
  let emailHash = cryptoJS.MD5(req.body.email).toString();

  let emailEncrypted = cryptoJS.AES.encrypt(
    req.body.email,
    "Secret Passphrase"
  ).toString();

  if (
    emailHash == null ||
    name == null ||
    surname == null ||
    password == null
  ) {
    return res.status(400).json({ error: "missing parameters" });
  }

  if (
    name.length >= 20 ||
    name.length < 2 ||
    surname.length >= 20 ||
    surname.length < 2
  ) {
    return res
      .status(400)
      .json({ error: "Wrong name or surname (must be length 2 - 30)" });
  }

  if (!EMAIL_REGEX.test(req.body.email)) {
    return res.status(400).json({ error: "email is not valid" });
  }

  if (!functions.checkPassword(password)) {
    return res.status(400).json({
      error: "Password is not valid (must be length min 4 and include 1 number",
    });
  }
  try {
    const user = await models.User.findOne({
      attributes: ["emailHash"],
      where: { emailHash: emailHash },
    });
    if (!user) {
      try {
        const hash = await bcrypt.hash(password, 10);

        const newUser = await models.User.create({
          name: name,
          surname: surname,
          email: emailEncrypted,
          emailHash: emailHash,
          password: hash,
          admin: 0,
        });

        try {
          await newUser.save();

          res.status(201).json({
            message: "Utilisateur créé ! " + "userId " + ": " + newUser.id,
          });
        } catch (error) {
          res.status(400).json({ error });
        }
      } catch (error) {
        res.status(500).json({ error });
      }
    } else {
      return res.status(409).json({ error: "email already used" });
    }
  } catch (error) {
    return res.status(500).json({ error: "unable to verify user" });
  }
};

exports.login = async (req, res, next) => {
  let emailHash = cryptoJS.MD5(req.body.email).toString();
  let password = req.body.password;

  if (emailHash == "" || password == "") {
    return res.status(400).json({ error: "Missing parameters" });
  }
  try {
    const user = await models.User.findOne({
      where: { emailHash: emailHash },
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Nom d'utilisateur (ou mot de passe) incorrect" });
    }

    if (functions.checkIfAccountIsLocked(user.lock_until)) {
      let waitingTime = (user.lock_until - Date.now()) / 1000 / 60;
      return res.status(402).json({
        error: "Compte bloqué, revenez dans: " + waitingTime + " minutes",
      });
    }

    if (user.lock_until && user.lock_until <= Date.now()) {
      try {
        await functions.resetUserLockAttempt(emailHash, user);

        const valid = await bcrypt.compare(req.body.password, user.password);

        if (!valid) {
          await functions.incrementLoginAttempt(emailHash, user);

          return res
            .status(403)
            .json({ error: "Mot de passe (ou email) incorrect !" });
        } else {
          await functions.sendNewToken(user._id, res);
        }
      } catch (error) {
        return res.status(500).json({ error });
      }
    } else {
      try {
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid && user.login_attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
          await functions.blockUserAccount(emailHash, user);
          return res.status(404).json({
            error:
              "Mot de passe (ou email) incorrect ! Vous avez atteint le nombre maximum d'essai, votre compte est maintenant bloqué!",
          });
        }

        if (!valid && user.login_attempts + 1 < MAX_LOGIN_ATTEMPTS) {
          await functions.incrementLoginAttempt(emailHash, user);
          return res
            .status(401)
            .json({ error: "Mot de passe (ou email) incorrect !" });
        }

        if (user.login_attempts > 0) {
          await functions.resetUserLockAttempt(emailHash, user);

          await functions.sendNewToken(user, res);
        } else {
          functions.sendNewToken(user, res);
        }
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.logout = (req, res, next) => {
  functions.eraseCookie(res);
};

exports.getUserProfile = async (req, res, next) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }
  const user = await models.User.findOne({
    attributes: ["id", "name", "surname", "email", "createdAt"],
    where: { id: CurrentUserId },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
  }
  if ((user && user.id === userInfos.userId) || userInfos.admin === true) {
    user.dataValues.canEdit = true;
    if (userInfos.admin === true) {
      user.dataValues.isAdmin = true;
      res.status(200).json(user);
    } else {
      res.status(200).json(user);
    }
  } else if (user) {
    res.status(200).json(user);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  // Params
  let name = req.body.name;
  let surname = req.body.surname;

  try {
    const user = await models.User.findOne({
      attributes: ["id", "name", "surname"],
      where: { id: CurrentUserId },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    if ((user && user.id === userInfos.userId) || userInfos.admin === true) {
      const updated = await user.update({
        name: name ? name : user.name,
        surname: surname ? surname : user.surname,
      });

      if (updated) {
        res.status(201).json("Profile mis à jour");
      } else {
        res.status(500).json({ error: "Cannot update profile" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to verify user" });
  }
};

exports.deleteUserProfile = async (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  try {
    const user = await models.User.findOne({
      where: { id: CurrentUserId },
      attributes: ["id", "name", "surname", "email", "createdAt"],
    });

    if ((user && user.id === userInfos.userId) || userInfos.admin === true) {
      try {
        await functions.destroyUser(user);

        res.status(200).json({ message: "User supprimé !" });
      } catch (error) {
        return res.status(400).json({ error });
      }
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};
 