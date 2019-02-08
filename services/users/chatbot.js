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

function schoolFoodArt (req, res) {
  console.log(req.body);
  let url = 'http://m.gachon.ac.kr/menu/menu.jsp';
  const day = moment().day();

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }

      let foodResult = $(`#toggle-view > li:nth-child(${day}) > dl`).text();

      return res.status(200).json({
          "version": "2.0",
          "template": {
              "outputs": [
                  {
                      "simpleText": {
                          "text": foodResult
                      }
                  }
              ],
              "quickReplies": [
                  {
                    "action": "message",
                    "label": "홈페이지",
                    "messageText": "가자"
                  },
                  {
                    "action": "message",
                    "label": "학식",
                    "messageText": "학식 보여줘"
                  }
              ]
          }
      });
  });
}

function schoolFoodEdu (req, res) {
  console.log(req.body);
  let url = 'http://m.gachon.ac.kr/menu/menu.jsp?gubun=B';
  const day = moment().day();

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }

      let foodResult = $(`#toggle-view > li:nth-child(${day}) > dl`).text();

      return res.status(200).json({
          "version": "2.0",
          "template": {
              "outputs": [
                  {
                      "simpleText": {
                          "text": foodResult
                      }
                  }
              ],
              "quickReplies": [
                  {
                    "action": "message",
                    "label": "홈페이지",
                    "messageText": "가자"
                  },
                  {
                    "action": "message",
                    "label": "학식",
                    "messageText": "학식 보여줘"
                  }
              ]
          }
      });
  });
}

function schoolFoodVision (req, res) {
  console.log(req.body);
  let url = 'http://m.gachon.ac.kr/menu/menu.jsp?gubun=C';
  const day = moment().day();

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }

      let foodResult = $(`#toggle-view > li:nth-child(${day}) > dl`).text();

      return res.status(200).json({
          "version": "2.0",
          "template": {
              "outputs": [
                  {
                      "simpleText": {
                          "text": foodResult
                      }
                  }
              ],
              "quickReplies": [
                  {
                    "action": "message",
                    "label": "홈페이지",
                    "messageText": "가자"
                  },
                  {
                    "action": "message",
                    "label": "학식",
                    "messageText": "학식 보여줘"
                  }
              ]
          }
      });
  });
}

function libraryRestSeat (req, res) {
  let url = 'http://dlibadm.gachon.ac.kr/GACHON_CENTRAL_BOOKING/webbooking/statusList.jsp';

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }
      let totalSeat = [126,156,282,228,180];
      let restSeat = [];
      for(let i = 1; i<6; i++) {
        restSeat.push($(`#mainContents > div > div > div > table > tbody > tr:nth-child(${i}) > td.last.right.bold.blue.bg_blue`).text());
      }

      return res.status(200).json({
        "version": "2.0",
        "template": {
          "outputs": [
            {
              "listCard": {
                "header": {
                  "title": "중앙도서관 여석 현황",
                  "imageUrl": "http://k.kakaocdn.net/dn/xsBdT/btqqIzbK4Hc/F39JI8XNVDMP9jPvoVdxl1/2x1.jpg"
                },
                "items": [
                  {
                    "title": "형설열람석",
                    "description": `${restSeat[0]} / ${totalSeat[0]}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                  },
                  {
                    "title": "탐구열람실",
                    "description": `${restSeat[1]} / ${totalSeat[1]}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/N4Epz/btqqHCfF5II/a3kMRckYml1NLPEo7nqTmK/1x1.jpg",
                  },
                  {
                    "title": "나눔열람실",
                    "description": `${restSeat[2]} / ${totalSeat[2]}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/bE8AKO/btqqFHI6vDQ/mWZGNbLIOlTv3oVF1gzXKK/1x1.jpg",
                  },
                  {
                    "title": "창의열람실",
                    "description": `${restSeat[3]} / ${totalSeat[3]}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/bE8AKO/btqqFHI6vDQ/mWZGNbLIOlTv3oVF1gzXKK/1x1.jpg",
                  },
                  {
                    "title": "노트북열람실",
                    "description": `${restSeat[4]} / ${totalSeat[4]}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/bE8AKO/btqqFHI6vDQ/mWZGNbLIOlTv3oVF1gzXKK/1x1.jpg",
                  }
                ],
                "buttons": [
                  {
                    "label": "도서관 자리 예약하기",
                    "action": "webLink",
                    "webLinkUrl": "http://lib.gachon.ac.kr/local/html/seatReservation"
                  }
                ]
              }
            }
          ]
        }
      });
  });
}

module.exports = {
    test: test,
    posttest: posttest,
    schoolFoodArt: schoolFoodArt,
    schoolFoodVision: schoolFoodVision,
    schoolFoodEdu: schoolFoodEdu,
    libraryRestSeat: libraryRestSeat,

}
