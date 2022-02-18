const models = require("../models");
const functions = require("./functions");
const fs = require("fs");

exports.createMessage = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  // Params
  let title = req.body.title;
  let content = req.body.content;

  if (title == null || content == null) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  if (title.length <= 2 || content.length <= 4) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  models.User.findOne({
    where: { id: userInfos.userId },
  })
    .then((user) => {
      if (user) {
        let imageUrl = null;

        if (req.file) {
          imageUrl = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
        }

        models.Message.create({
          title: title,
          content: content,
          imageUrl: imageUrl,
          likes: 0,
          UserId: user.id,
        })
          .then((newMessage) => {
            if (newMessage) {
              return res.status(201).json({ Message: "Message posted !" });
            } else {
              return res.status(500).json({ error: "Cannot post message" });
            }
          })
          .catch((error) => {
            return res.status(500).json({ error: "Internal error" });
          });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: "Unable to verify user" });
    });
};

exports.getAllMessages = (req, res) => {
  const page = req.query.page;
  const size = req.query.size;
  //console.log(page);

  const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: messages } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, messages, totalPages, currentPage };
  };

  let fields = req.query.fields;
  let order = req.query.order;
  const { limit, offset } = getPagination(page, size);

  models.Message.findAndCountAll({
    order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
    attributes: fields !== "*" && fields != null ? fields.split(",") : null,
    limit: !isNaN(limit) ? limit : 5,
    offset: !isNaN(offset) ? offset : 0,
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id"],
      },
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((error) => res.status(404).json(data));
};

exports.getUserAllMessages = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let CurrentUserId = req.params.id;
  let fields = req.query.fields;
  let order = req.query.order;

  const page = req.query.page;
  const size = req.query.size;
  //console.log(page);

  const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: messages } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, messages, totalPages, currentPage };
  };
  const { limit, offset } = getPagination(page, size);

  models.Message.findAndCountAll({
    where: { userId: CurrentUserId },
    order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
    attributes: fields !== "*" && fields != null ? fields.split(",") : null,
    limit: !isNaN(limit) ? limit : 5,
    offset: !isNaN(offset) ? offset : 0,
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id"],
      },
    ],
  }).then((data) => {
    const response = getPagingData(data, page, limit);
    console.log(response.messages.length);
    if (
      (response.messages.length > 0 &&
        response.messages[0].dataValues.UserId === userInfos.userId) ||
      userInfos.admin === true
    ) {
      for (index = 0; index < response.messages.length; index++) {
        response.messages[index].dataValues.canEdit = true;
      }
      res.send(response);
    } else if (response.totalItems > 0) {
      res.send(response);
    } else {
      res.status(404).json({ error: "No messages found" });
    }
  });
};

exports.getOneMessage = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let messageId = req.params.id;

  models.Message.findOne({
    where: { id: messageId },
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id"],
      },
    ],
  })
    .then((messages) => {
      if (
        (messages && messages.UserId === userInfos.userId) ||
        userInfos.admin === true
      ) {
        messages.dataValues.canEdit = true;

        res.status(200).json(messages);
      } else if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).send({ error: "Message not found" });
      }
    })
    .catch((error) => {
      return res.status(404).json({ error: "Message not found" });
    });
};

exports.deleteMessage = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let messageId = req.params.id;
  console.log(messageId);

  models.Message.findOne({
    where: { id: messageId },
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id"],
      },
    ],
  })
    .then((message) => {
      if (
        (message && message.UserId === userInfos.userId) ||
        userInfos.admin === true
      ) {
        if (message.imageUrl) {
          const filename = message.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            models.Message.destroy({
              where: { id: messageId },
              include: [
                {
                  model: models.User,
                  attributes: ["name", "surname", "id"],
                },
              ],
            })
              .then(() => {
                res.status(200).json({ message: "Objet supprimé !" });
              })
              .catch((error) => res.status(400).json({ error }));
          });
        } else {
          models.Message.destroy({
            where: { id: messageId },
            include: [
              {
                model: models.User,
                attributes: ["name", "surname", "id"],
              },
            ],
          })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => {
      return res.status(404).json({ error: error });
    });
};
