const appConfig = require('../../config/appConfig');
const cryptojsUtil = require('../../utils/crypto');

module.exports = (p) => {
    return cryptojsUtil.encrypt(p, appConfig.PWD_SECRET);
};