const appConfig = require('../../config/appConfig');
const cryptojsUtil = require('../../utils/crypto');

module.exports = (p) => {
    return cryptojsUtil.decrypt(p, appConfig.PWD_SECRET);
};