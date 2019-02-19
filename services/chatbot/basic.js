require('dotenv').config()
const models = require('../../models');
const jsonHelper = require('../jsonHelper');

function homeMenu (req,res) {
  const user_id = req.body.userRequest.user.id;
  return res.status(200).json(jsonHelper.basicJson.sendHomeMenu());
}


module.exports = {
    homeMenu: homeMenu,
}
