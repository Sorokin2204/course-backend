const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { CustomError, TypeError } = require('../models/customError.model');
const moment = require('moment/moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mailService = require('../services/mail-service');
const { currencyFormat } = require('../utils/currencyFormat');
const User = db.user;
const Image = db.image;
const Advert = db.advert;
const Category = db.category;

class PageController {
  async uploadFile(req, res) {
    if (!req.files) {
      res.send({
        status: 'failed',
      });
    } else {
      let file = req.files.file;
      const newUuid = uuidv4();
      const newFileName = `${newUuid}.${getFileExt(file.name)}`;
      file.mv('./public/files/' + newFileName);
      res.send({
        status: 'success',
        path: newFileName,
      });
    }
  }
  async update(req, res) {
    const { name, surname, email, phone, isDeleteAvatar, company, profession, about, gender } = req.body;
    let newAvatar = req.files?.avatar;
    let updateData = {
      name,
      surname,
      email,
      phone,
      ...(isDeleteAvatar === 'true' && { avatar: null }),
      ...(company && { company }),
      ...(profession && { profession }),
      ...(about && { about }),
      ...(gender && { gender }),
    };

    if (newAvatar) {
      const newUuid = uuidv4();
      const newFileName = `${newUuid}.${getFileExt(newAvatar.name)}`;
      newAvatar.mv('./public/files/' + newFileName);
      updateData.avatar = newFileName;
    }
    await User.update(updateData, {
      where: {
        id: res.locals.userData?.id,
      },
    });
    res.json(true);
  }

  async auth(req, res) {
    const authHeader = req.headers['auth-token'];
    if (!authHeader) {
      throw new CustomError();
    }
    const tokenData = jwt.verify(authHeader, process.env.SECRET_TOKEN, (err, tokenData) => {
      if (err) {
        throw new CustomError();
      }
      return tokenData;
    });
    const findUser = await User.findOne({ where: { id: tokenData.id } });

    res.json({ ...findUser.toJSON() });
  }
  async login(req, res) {
    const { emailLogin: email, passwordLogin: password } = req.body;

    const findUser = await User.findOne({ where: { email } });
    if (!findUser) {
      throw new CustomError(400, TypeError.LOGIN_ERROR);
    }

    const passCheck = await bcrypt.compare(password, findUser.password);
    if (!passCheck) {
      throw new CustomError(400, TypeError.LOGIN_ERROR);
    }

    const token = jwt.sign({ id: findUser.id, email: findUser.email }, process.env.SECRET_TOKEN, { expiresIn: '24h' });
    res.json({ token: token });
  }
  async swtichAccessCourse(req, res) {
    const { id } = req.query;
    const findUser = await User.findOne({
      where: {
        id,
      },
    });
    if (!findUser) {
    }
    await User.update(
      { activeCourse: !findUser?.activeCourse },
      {
        where: {
          id,
        },
      },
    );
    res.json(true);
  }
  async getUserList(req, res) {
    const data = await User.findAll({
      attributes: ['name', 'surname', 'id', 'activeCourse'],
    });
    res.json(data);
  }
  async createUser(req, res) {
    const { email, password, name, surname, phone } = req.body;
    const passHash = await bcrypt.hash(password, 3);
    const findUserEmail = await User.findOne({ where: { email } });

    if (findUserEmail) {
      throw new CustomError(400, TypeError.USER_EXIST);
    }

    const newUser = await User.create({
      email,
      password: passHash,
      name,
      surname,
      phone: phone.replace(/\D/g, ''),
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.SECRET_TOKEN, { expiresIn: '1h' });
    res.json({ token: token });
  }
}
function getFileExt(name) {
  return /(?:\.([^.]+))?$/.exec(name)[1];
}

module.exports = new PageController();
