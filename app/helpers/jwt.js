const appConfig = require("../../config/appConfig");
const jwt = require("jsonwebtoken");

const createJWT = async (payload, user, expiresIn) => {
  payload = payload || null;
  user = user || null;
  expiresIn = expiresIn || "24h"; // expires in 24 hours
  if (!payload && !user) {
    throw new Error("Please define payload");
  }
  if (!payload) {
    payload = {
      user: {
        ...user,
      },
    };
  }
  return jwt.sign(payload, appConfig.SECRET, {
    expiresIn: expiresIn,
  });
};

const verifyJWT = async (token) => {
  return jwt.verify(token, appConfig.SECRET);
};

const decodeJWT = async (token) => {
  return jwt.decode(token);
};
module.exports = {
  createJWT,
  verifyJWT,
  decodeJWT,
};
