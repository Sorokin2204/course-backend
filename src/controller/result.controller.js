const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Result = db.result;

class ResultController {
  async getResult(req, res) {
    const { userId } = req.query;
    res.json(await Result.findOne({ where: { userId } }));
  }
  async upsertResultUser(req, res) {
    const { userId, step, dataCourse, chapter } = req.body;
    const findResult = await Result.findOne({
      where: { userId },
    });
    if (!findResult) {
      await Result.create({
        userId,
        step,
        data: JSON.stringify(dataCourse),
        chapter,
      });
    } else {
      await Result.update(
        {
          step,
          data: JSON.stringify(dataCourse),
          chapter,
        },
        { where: { id: findResult?.id } },
      );
    }

    res.json(true);
  }
}

module.exports = new ResultController();
