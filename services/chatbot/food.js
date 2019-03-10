require('dotenv').config()
const models = require('../../models');
const rp = require('request-promise');
const jsonHelper = require('../jsonHelper');
const cheerio = require('cheerio');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./awscreds.json');

function foodRanking (req, res) {
  models.Food.findAll({
    limit: 5,
    include: [{
      model: models.Food_image,
      as: 'images',
      where: {verify: true},
      required: false
    }],
    order: [
        // Will escape username and validate DESC against a list of valid direction parameters
        ['like', 'DESC']
    ]
  }).then(food => {
      console.log(food);
      if (food){
          return res.status(200).json(jsonHelper.foodJson.sendFoodRanking(food));
      } else {
          // Return when no data found
          return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
      }
  }).catch(function (err){
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
  });
}

// blockId: 5c616cd7384c553f07cd288a
function foodInit (req, res) {
  models.sequelize.query(`SELECT count(*) as count FROM food;`).then(cnt => {
    return res.status(200).json(jsonHelper.foodJson.sendFoodInit(cnt));
  }).catch(function (err){
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
  });
}

function foodByType (req, res) {
  const food_type = req.body.action.clientExtra.food_type;
  models.Food.findAll({
    limit: 10,
    where: {
        type: food_type
    },
    include: [{
      model: models.Food_image,
      as: 'images',
      where: {verify: true},
      required: false
    }],
    order: models.sequelize.random()
  }).then(food => {
      console.log(food);
      if (food){
          return res.status(200).json(jsonHelper.foodJson.sendFoodCarousel(`가천대 주변의 ${food_type}맛집 리스트에요! 해당 음식점이름 버튼을 클릭해서 상세정보를 확인해보세요!`, food));
      } else {
          // Return when no data found
          return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
      }
  }).catch(function (err){
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
  });
}

// blockID: 5c64110de8212717d2bfaabc
function foodDetail (req, res) {
  const food_name = req.body.userRequest.utterance;
  models.Food.findOne({
    where: {
        name: food_name
    },
    include: [{
      model: models.Food_image,
      as: 'images',
      where: {verify: true},
      required: false
    }]
  }).then(food => {
    console.log(JSON.stringify(food));
      if (food){
          return res.status(200).json(jsonHelper.foodJson.sendFoodDetail(food));
      } else {
          // Return when no data found
          return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
      }
  }).catch(function (err){
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
  });
}

// blockID: 5c64175b384c553f07cd3850
function foodLike (req, res) {
  const food_id = req.body.action.clientExtra.food_id;
  const user_id = req.body.userRequest.user.id;
  models.User.findOrCreate({
    where: {
        bot_id: user_id
    }
  }).spread((user, created) => {
    models.User_like.findAll({
      where: {
          user_id: user.id
      }
    }).then(result => {
      let condition = true;
      result.forEach(data => {
        if(String(data.food_id) === food_id) {
          condition = false;
        }
      });

      if (condition === true) {
        models.Food.findOne({
          where: {
              id: food_id
          }
        }).then(food => {
          console.log(food);
          if (food) {
            models.Food.update({
              like: (food.like + 1)
            }, {
                where: {
                    id: food_id
                } // Condition
            }).then(result2 => {
                if (result2){
                  models.User_like.create({
                    food_id: food_id,
                    user_id: user.id
                  }).then(final_result => {
                    return res.status(200).json(jsonHelper.foodJson.sendFoodLikeY(food_id, food));
                  }).catch(err => {
                    console.log(err.message);
                    return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
                  })
                } else {
                  return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
                }
            }).catch(err => {
              console.log(err.message);
              return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
            });
          } else {
            return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
          }
        }).catch(err => {
          console.log(err.message);
          return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
        });
      } else {
        models.Food.findOne({
          where: {
              id: food_id
          }
        }).then(food => {
          return res.status(200).json(jsonHelper.foodJson.sendFoodLikeN(food.name));
        }).catch(err => {
          return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
        })
      }
    }).catch(err => {
      console.log(err.message);
      return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
    });
  }).catch(err => {
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

// blockID: 5c641ae35f38dd5839237e30
function failLike (req, res) {
  return res.status(200).json(jsonHelper.foodJson.sendFailLike());
}

// 5c668bb1384c5541a0ee4fde
function foodImage (req, res) {
  const food_id = req.body.action.clientExtra.food_id;
  const user_id = req.body.userRequest.user.id;

  models.User.findOrCreate({
    where: {
        bot_id: user_id
    }
  }).spread((user, created) => {
    models.User.update(
      {
        last_food_id: food_id,
      },     // What to update
      {where: {
              bot_id: user_id}
      });
  }).catch(err => {
    console.log(err.message);
  });
  models.Food_image.findAll({
    where: {
        food_id: food_id,
        verify: true,
    },
    limit: 10,
    order: models.sequelize.random()
  }).then(image => {
      if (image.length > 0){
        models.Food.findOne({
          where: {
              id: food_id
          },
        }).then(food => {
            if (food){
                return res.status(200).json(jsonHelper.foodJson.sendFoodImageCarousel(`JMT!`, food_id, food.name, image));
            } else {
                // Return when no data found
                return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
            }
        }).catch(function (err){
          return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
        });
      } else {
        return res.status(200).json(jsonHelper.foodJson.sendNoImage(food_id));
      }
  }).catch(function (err){
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

// 5c68310e384c5541a0ee51e6
function imageUpload (req, res) {
  const s3 = new AWS.S3();
  const user_id = req.body.userRequest.user.id;

  let image = JSON.parse(req.body.action.detailParams.secureimage.value);
  image = image.secureUrls.replace('List','').substring(1).slice(0,-1);
  image = image.split(', ');
  console.log(image);

  models.User.findOne({
    where: {
        bot_id: user_id
    },
  }).then(user => {
      if (user){
        const last_food_id = user.last_food_id
        image.forEach((data, index, array) => {
          let options = {
              uri: `${data}`,
              encoding: null
          };


          rp(options)
              .then(function (response) {
                let s3params = {
                    Body: response,
                    Bucket: "gachonbot",
                    Key: `${last_food_id}_${Math.floor(Math.random() * 100000) + 1}.jpg`,
                    ACL: "public-read"
                };

                s3.upload(s3params, function(err, img) {
                    if (err) {
                      console.log(err.message);
                    } else {
                      models.Food_image.create({
                        food_id: last_food_id,
                        url: img.Location,
                      }).then(result => {
                        if (index === (array.length -1)) {
                          return res.status(200).json(jsonHelper.basicJson.sendSimpleText(`소중한 사진을 제공해주셔서 감사합니다! 검토 후 업로드될 예정입니다!`));
                        }
                      }).catch(err => {
                        console.log(err.message);
                        return res.status(200).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
                      });
                    }
                });
              })
              .catch(function (err) {
                console.log(err.message);
                return res.status(200).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
              });
        });
      } else {
          return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
      }
  }).catch(function (err){
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

function test (req, res) {
  models.Food.findOne({
    where: {
        id: 26
    },
    include: [{
      model: models.Food_image,
      as: 'images',
      where: {food_id: 26}
    }]
  }).then(food => {
      console.log(JSON.stringify(food));
      return res.status(200).json(food)
  }).catch(function (err){
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
  });
}

//
function foodRandom (req, res) {
  models.Food.findOne({
    order: models.sequelize.random(),
    include: [{
      model: models.Food_image,
      as: 'images',
      where: {verify: true},
      required: false
    }]
  }).then(food => {
      if (food){
          return res.status(200).json(jsonHelper.foodJson.sendFoodRandom(food.id, food));
      } else {
          // Return when no data found
          return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
      }
  }).catch(function (err){
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'))
  });
}

module.exports = {
    foodRanking: foodRanking,
    foodInit: foodInit,
    foodByType: foodByType,
    foodDetail: foodDetail,
    foodLike: foodLike,
    failLike: failLike,
    foodImage: foodImage,
    imageUpload: imageUpload,
    test: test,
    foodRandom: foodRandom,
}
