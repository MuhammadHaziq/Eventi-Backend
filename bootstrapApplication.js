const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDoc = require('./swagger');

exports.bootstrap = app => {
    require('./app/helpers').bootstrap();
    require('./app/routes').bootstrap(app);
    require('./config/connectDatabase').bootstrap();
};