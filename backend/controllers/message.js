const models = require("../models");
const functions = require("../utils/functions");

exports.createMessage = async (req, res) => {
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

  try {
    const user = await models.User.findOne({
      where: { id: userInfos.userId },
    });

    if (user) {
      try {
        const newMessage = models.Message.create({
          title: title,
          content: content,
          likes: 0,
          UserId: user.id,
        });

        if (newMessage) {
          return res.status(201).json({ Message: "Message posted !" });
        } else {
          return res.status(500).json({ error: "Cannot post message" });
        }
      } catch (error) {
        return res.status(500).json({ error: "Internal error" });
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Unable to verify user" });
  }
};

exports.getAllMessages = async (req, res) => {
  const page = req.query.page;
  const size = req.query.size;

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

  try {
    const data = await models.Message.findAndCountAll({
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
    });

    const response = getPagingData(data, page, limit);
    return res.send(response);
  } catch (error) {
    return res.status(404).json(data);
  }
};

exports.getUserAllMessages = async (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let CurrentUserId = req.params.id;
  let fields = req.query.fields;
  let order = req.query.order;

  const page = req.query.page;
  const size = req.query.size;

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

  const data = await models.Message.findAndCountAll({
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
  });

  const response = getPagingData(data, page, limit);
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
};

exports.getOneMessage = async (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let messageId = req.params.id;

  try {
    const message = await models.Message.findOne({
      where: { id: messageId },
      include: [
        {
          model: models.User,
          attributes: ["name", "surname", "id"],
        },
      ],
    });

    if (
      (message && message.UserId === userInfos.userId) ||
      userInfos.admin === true
    ) {
      message.dataValues.canEdit = true;

      res.status(200).json(message);
    } else if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).send({ error: "Message not found" });
    }
  } catch (error) {
    return res.status(404).json({ error: "Message not found" });
  }
};

exports.deleteMessage = async (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let messageId = req.params.id;
  console.log(messageId);
  try {
    const message = await models.Message.findOne({
      where: { id: messageId },
      include: [
        {
          model: models.User,
          attributes: ["name", "surname", "id"],
        },
      ],
    });

    if (
      (message && message.UserId === userInfos.userId) ||
      userInfos.admin === true
    ) {
      try {
        await models.Message.destroy({
          where: { id: messageId },
          include: [
            {
              model: models.User,
              attributes: ["name", "surname", "id"],
            },
          ],
        });

        return res.status(200).json({ message: "Objet supprimé !" });
      } catch (error) {
        return res.status(400).json({ error });
      }
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};
