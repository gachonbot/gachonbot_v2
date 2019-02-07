const client = require('cheerio-httpcli');
const moment = require('moment');

const param = {};
client.set('headers', {           // 크롤링 방지 우회를 위한 User-Agent setting
  'data-useragent' : 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
  'Accept-Charset': 'utf-8'
});


function test (req, res) {
  // const res1 = req.body.res1;
  return res.status(200).json({success: true, response: 'hi'})
}

function posttest (req, res) {
  const res1 = req.body.res1;
  return res.status(200).json({success:true, response: res1});
}

function schoolfood (req, res) {
  console.log(req.body);
  let url = 'http://m.gachon.ac.kr/menu/menu.jsp';
  const day = moment().day();

  let dayString = '#toggle-view > li:nth-child(1) > dl';
  switch (day) {
    case 1:
    break;
    case 2:
      dayString = '#toggle-view > li:nth-child(2) > dl';
    break;
    case 3:
      dayString = '#toggle-view > li:nth-child(3) > dl';
    break;
    case 4:
      dayString = '#toggle-view > li:nth-child(4) > dl';
    break;
    case 5:
      dayString = '#toggle-view > li:nth-child(5) > dl';
    break;

  }

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }

      let foodResult = $(dayString).text();

      // return res.status(200).json({
      //     "version": "2.0",
      //     "template": {
      //         "outputs": [
      //             {
      //                 "simpleText": {
      //                     "text": foodResult
      //                 }
      //             }
      //         ]
      //     }
      // });
      return res.status(200).json({
        "contents": [
            {
              "type": "text",
              "text": foodResult
            }
          ],
        "quickReplies": [
            {
              "type": "url",
              "label": "홈페이지",
              "message": "홈페이지 이동하기",
              "data": {
                "url":"http://www.gachon.ac.kr"
              }
            },
            {
              "type": "text",
              "label": "학식보기",
              "message": "학식",
              "data": {
              }
            }
        ]
      });

  });
}

module.exports = {
    test: test,
    posttest: posttest,
    schoolfood: schoolfood
}
