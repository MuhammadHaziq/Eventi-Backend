const appConfig = require('../../config/appConfig');

module.exports = (stateName) => {
    return appConfig.STATE_MAPPING.find(state => state.name === stateName);
};