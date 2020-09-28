const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("database", "", "", {
  dialect: "sqlite",
  storage: "./data/database.sqlite",
});

sequelize
  .authenticate()
  .then((res) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = sequelize;
