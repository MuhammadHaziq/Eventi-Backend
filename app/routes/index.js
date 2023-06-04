const fs = require("fs");

exports.bootstrap = (app) => {
  fs.readdirSync(__dirname).forEach((folder) => {
    if (folder === "index.js") {
      return;
    }
    fs.readdirSync(`${__dirname}/${folder}`).forEach((file) => {
      const route = require(`${__dirname}/${folder}/${file}`);

      if (!route || !route.router) {
        return;
      }
      // app.use(`/api/${folder}/${route.basePath ? `${route.basePath}` : ''}`, route.router);
      app.use(
        `/api/${route.basePath ? `${route.basePath}` : ""}`,
        route.router
      );
    });
  });
};
