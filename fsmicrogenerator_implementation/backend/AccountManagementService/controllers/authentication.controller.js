const bcrypt = require("bcryptjs");
const { jwtSign, jwtVerify } = require("../helpers/helpers");

const logger = require("../middlewares/winston.middleware");
const User = require("../models/user.model");
const { FindOne } = require("../models/repositories/user.repositorie");

exports.login = async (req, res) => {
  try {
    let user = await FindOne(req, "groupe", {
      $or: [{ email: req.body.login }, { pseudo: req.body.pseudo }],
    });
    if (user) {
      if (user.etatObjet != "code-1" || user.etatCompte != "code_4316") {
        return res.status(406).send({
          message: "account is disabled please contact your administrator",
        });
      } else {
        if (bcrypt.compareSync(req.body.password, user.pwCrypte)) {
          let token = jwtSign({ userId: user._id });
          let dateConnection = new Date();
          await User.updateOne(
            { _id: user._id },
            {
              dateDerniereConnexion: dateConnection,
              $addToSet: { historiqueConnexion: { debut: dateConnection } },
              $inc: { nbreConnection: 1 },
            }
          );
          user.nbreConnection += 1;
          user.dateDerniereConnexion = dateConnection;
          let expiresIn =
            dateConnection.getTime() +
            +process.env.TOKEN_EXPIRATION_DURATION_IN_MILLISECOND;
          return res.status(200).send({ user, expiresIn, token });
        }
      }
    }

    return res.status(401).send({ message: "login or password is incorrect" });
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.regenerateToken = (req, res) => {
  let { userId } = jwtVerify(req.headers[process.env.TOKEN_FIELD_NAME]);
  let token = jwtSign({ userId });
  let expiresIn =
    Date.now() + +process.env.TOKEN_EXPIRATION_DURATION_IN_MILLISECOND;
  res.status(200).send({ expiresIn, token });
};

exports.logout = async (req, res) => {
  try {
    let doc = await User.findByIdAndUpdate(
      req.body.user,
      {
        $set: {
          "historiqueConnexion.$[element].fin": new Date(),
          "historiqueConnexion.$[element].motif": req.body.motif,
        },
      },
      {
        arrayFilters: [{ "element.fin": { $exists: false } }],
        new: true,
      }
    );
    res.status(200).send(doc);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getOne = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");
    let data = await FindOne(req, "", params.condition, params.options);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};
