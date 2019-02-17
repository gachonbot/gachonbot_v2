const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW, {
        logging: console.log,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+09:00',
        define: {
            // For Korean support
            charset: 'utf8',
            collate: 'utf8_general_ci',

            // don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: false,

            // don't delete database entries but set the newly added attribute deletedAt
            // to the current date (when deletion was done). paranoid will only work if
            // timestamps are enabled
            paranoid: false,

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,

            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: false,
        }

    }

);

const Major = sequelize.define('major', {
  id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
  name: Sequelize.STRING,
  number: Sequelize.STRING,
  notice: Sequelize.STRING,
});

const Food = sequelize.define('food', {
  id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  number: Sequelize.STRING,
  where: Sequelize.STRING,
  detail: Sequelize.STRING,
  like: {type: Sequelize.INTEGER, defaultValue: 0},
});

const Food_image = sequelize.define('food_image', {
  id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
  url: Sequelize.STRING,
  verify: { type: Sequelize.BOOLEAN, defaultValue: false }
});

Food.hasMany(Food_image, {as: 'images'})

const Air = sequelize.define('air', {
  id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
  pm_10: Sequelize.INTEGER,
  pm_25: Sequelize.INTEGER,
  grade_10: Sequelize.INTEGER,
  grade_25: Sequelize.INTEGER,
  time: Sequelize.STRING,
});

const Weather = sequelize.define('weather', {
  id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
  name: Sequelize.STRING,
  tc: Sequelize.FLOAT,
  tmin: Sequelize.FLOAT,
  tmax: Sequelize.FLOAT,
  humidity: Sequelize.FLOAT,
  time: Sequelize.STRING,
});

const User = sequelize.define('user', {
  id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
  bot_id: {
          type: Sequelize.STRING,
      },
  major: Sequelize.STRING,
  last_food_id: Sequelize.INTEGER,
});


const User_like = sequelize.define('user_like', {
  id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
  food_id: Sequelize.INTEGER,
});

User.hasMany(User_like, {as: 'likes'});


module.exports = {
    sequelize: sequelize,
    Major: Major,
    Food: Food,
    Air: Air,
    Weather: Weather,
    Food_image: Food_image,
    User: User,
    User_like: User_like,
};
