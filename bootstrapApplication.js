exports.bootstrap = (app) => {
  console.log("BOOSTRAP WORKING");
  require("./app/helpers").bootstrap();
  require("./app/routes").bootstrap(app);
  require("./config/connectDatabase").bootstrap();
};
