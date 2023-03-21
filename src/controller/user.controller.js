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
    const { name, surname, email, phone, isDeleteAvatar } = req.body;
    let newAvatar = req.files?.avatar;
    console.log(res.locals.userData);
    let updateData = {
      name,
      surname,
      email,
      phone,
      ...(isDeleteAvatar && { avatar: null }),
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

  async createAdvert(req, res) {
    const { images, category, desc, price, title } = req.body;
    const createAdvert = await Advert.create({
      userId: res.locals.userData?.id,
      title,
      price: parseInt(price.replace(/\D/g, '')),
      status: 'publish',
      desc,
      categoryId: category,
    });
    let imagesData = [];
    let countImg = 0;
    for (let img of images) {
      if (!img?.isDeleted) {
        imagesData.push({ path: img.file, order: countImg, isMain: countImg == 0, advertId: createAdvert?.id });
        countImg++;
      }
    }
    await Image.bulkCreate(imagesData);
    res.json(true);
  }
  async changeStatus(req, res) {
    const { advertId, status } = req.query;
    const findExistAdvert = await Advert.findOne({
      where: {
        id: advertId,
        userId: res.locals.userData?.id,
      },
    });
    if (findExistAdvert) {
      await Advert.update(
        { status },
        {
          where: {
            id: advertId,
            userId: res.locals.userData?.id,
          },
        },
      );
    }
    res.json(true);
  }
  async updateAdvert(req, res) {
    const { images, category, desc, price, title } = req.body;
    const { advertId } = req.params;
    const findAdvert = await Advert.findOne({
      where: {
        id: advertId,
        status: 'publish',
        userId: res.locals.userData?.id,
      },
    });
    if (!findAdvert) {
      throw new CustomError();
    }
    await Advert.update(
      {
        title,
        price: parseInt(price.toString().replace(/\D/g, '')),

        desc,
        categoryId: category,
      },
      {
        where: {
          id: advertId,
        },
      },
    );

    let countImg = 0;
    for (let img of images) {
      if (img?.isDeleted) {
        await Image.destroy({ where: { id: img?.innerId, advertId } });
      } else if (img?.isNew) {
        await Image.create({ path: img.file, order: countImg, isMain: countImg == 0, advertId: advertId });
        countImg++;
      } else if (img?.innerId) {
        await Image.update({ order: countImg, isMain: countImg == 0 }, { where: { id: img?.innerId } });
        countImg++;
      }
    }

    res.json(true);
  }
  async getListAdvert(req, res) {
    const { sort = 'by-date', page = 1, category } = req.query;
    const offset = (page - 1) * 9;
    let sortCond;
    if (sort == 'by-date') {
      sortCond = [['createAt', 'DESC']];
    } else if (sort == 'by-chip') {
      sortCond = [['price', 'ASC']];
    } else if (sort == 'by-rich') {
      sortCond = [['price', 'DESC']];
    }
    const advertList = await Advert.findAndCountAll({
      where: {
        status: 'publish',
      },
      ...(sortCond && {
        order: sortCond,
      }),
      include: [
        {
          model: Category,
          where: {
            ...(category && {
              id: category,
            }),
          },
        },
        {
          model: Image,
          where: {
            order: 0,
          },
          required: false,
        },
        {
          model: User,
        },
      ],
      offset,
      limit: 9,
    });
    res.json(advertList);
  }

  async getSingleAdvert(req, res) {
    const { id } = req.params;
    const advertSingle = await Advert.findOne({
      where: {
        status: 'publish',
        id,
      },
      order: [[Image, 'order', 'asc']],
      include: [
        {
          model: Category,
        },
        {
          model: Image,
          // order: [['order', 'ASC']],

          required: false,
        },
        {
          model: User,

          required: false,
        },
      ],
    });

    const publishCount = await Advert.count({ where: { userId: advertSingle?.user?.id, status: 'publish' } });

    res.json({ ...advertSingle.toJSON(), countAdvert: publishCount });
  }
  async getCategory(req, res) {
    const { id } = req.params;
    const findCategory = await Category.findOne({
      where: {
        id,
      },
    });
    if (findCategory) {
      res.json(findCategory);
    } else {
      throw new CustomError();
    }
  }
  async getAdvertUser(req, res) {
    const { page = 1, status = 'publish' } = req.query;
    const offset = (page - 1) * 9;
    const advertList = await Advert.findAndCountAll({
      where: {
        status,
        userId: res.locals.userData?.id,
      },
      include: [
        {
          model: Category,
        },
        {
          model: Image,
          where: {
            order: 0,
          },
          required: false,
        },
      ],
      offset,
      limit: 9,
    });
    res.json(advertList);
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
    const publishCount = await Advert.count({ where: { userId: tokenData.id, status: 'publish' } });
    const disableCount = await Advert.count({ where: { userId: tokenData.id, status: 'disabled' } });
    const canceledCount = await Advert.count({ where: { userId: tokenData.id, status: 'canceled' } });
    const soldCount = await Advert.count({ where: { userId: tokenData.id, status: 'sold' } });
    res.json({ ...findUser.toJSON(), publishCount, disableCount, canceledCount, soldCount });
  }
  async login(req, res) {
    const { email, password } = req.body;

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
  async createUser(req, res) {
    const { email, password, name, surname, phone } = req.body;
    const passHash = await bcrypt.hash(password, 3);
    const findUserEmail = await User.findOne({ where: { email } });
    console.log(req.body);
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
  async searchAdvert(req, res) {
    const { term } = req.query;

    const findAdverts = await Advert.findAndCountAll({
      where: {
        status: 'publish',
        title: { [Op.like]: `%${term}%` },
      },
      include: [
        {
          model: Category,
        },
        {
          model: Image,
          where: {
            order: 0,
          },
          required: false,
        },
      ],
    });
    res.json(findAdverts);
  }
}
function getFileExt(name) {
  return /(?:\.([^.]+))?$/.exec(name)[1];
}

module.exports = new PageController();
