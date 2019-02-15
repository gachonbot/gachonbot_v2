require('dotenv').config()
const client = require('cheerio-httpcli');
const moment = require('moment');
const schedule = require('node-schedule');
const models = require('../../models');
const rp = require('request-promise');
const jsonHelper = require('./jsonHelper');



const param = {};
client.set('headers', {           // 크롤링 방지 우회를 위한 User-Agent setting
  'data-useragent' : 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
  'Accept-Charset': 'utf-8'
});

let weather_scheduler = schedule.scheduleJob('1 * * * *', function(){
  rp(`https://api2.sktelecom.com/weather/current/hourly?version=1&lat=37.450745&lon=127.128804&appkey=${process.env.WEATHER_KEY}`)
      .then(function (response) {
          response = JSON.parse(response);
          response = response.weather.hourly[0];
          models.Weather.create({
            name: response.sky.name,
            tc: parseFloat(response.temperature.tc),
            tmin: parseFloat(response.temperature.tmin),
            tmax: parseFloat(response.temperature.tmax),
            humidity: parseFloat(response.humidity),
            time: response.timeRelease,
          }).then(result => {
            return result;
          }).catch(err => {
            return err.message;
          });
      })
      .catch(function (err) {
          console.log(err);
      });
});

let air_scheduler = schedule.scheduleJob('2 * * * *', function(){
  rp(`http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${process.env.AIR_KEY}&numOfRows=1&pageSize=1&pageNo=1&startPage=1&stationName=${encodeURIComponent('상대원동')}&dataTerm=DAILY&ver=1.3&_returnType=json`)
      .then(function (response) {
        response = JSON.parse(response);
        response = response.list[0];
        models.Air.create({
          pm_10: parseInt(response.pm10Value),
          pm_25: parseInt(response.pm25Value),
          grade_10: parseInt(response.pm10Grade1h),
          grade_25: parseInt(response.pm25Grade1h),
          time: response.dataTime,
        }).then(result => {
          return result;
        }).catch(err => {
          return err.message;
        });
      })
      .catch(function (err) {
          console.log(err);
      });
});


function test (req, res) {
  // const res1 = req.body.res1;
  return res.status(200).json({success: true, response: 'hi'})
}

function posttest (req, res) {
  const res1 = req.body.res1;
  return res.status(200).json({success:true, response: res1});
}

function foodParser (req, res) {
  console.log('블록아이디'+req.body.userRequest.block.id);
  let placeParam = (req.body.action.params.place);
  let url = 'http://m.gachon.ac.kr/menu/menu.jsp';

  switch (placeParam) {
    case '교육대학원':
      url = 'http://m.gachon.ac.kr/menu/menu.jsp?gubun=B';
    break;
    case '비전타워':
      url = 'http://m.gachon.ac.kr/menu/menu.jsp?gubun=C';
    break;
  }

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

function schoolFoodArt (req, res) {
  console.log('블록아이디'+req.body.userRequest.block.id);
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
  console.log('블록아이디'+req.body.userRequest.block.id);
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
  console.log('블록아이디'+req.body.userRequest.block.id);
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
  console.log('블록아이디'+req.body.userRequest.block.id);
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

function noticeParse (req, res) {
  console.log('블록아이디'+req.body.userRequest.block.id);
  let url = 'http://m.gachon.ac.kr/gachon/notice.jsp?boardType_seq=358';

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }
      let noticeArray = [];

      $('#contnet > div.list > ul > li').each(function (idx) {
        if($(this).children('img').attr('alt') === '공지') {

        } else {
          noticeArray.push({title: $(this).children('a').text().trim().replace(/\n/g, ' '), url: 'http://m.gachon.ac.kr/gachon/'+$(this).children('a').attr('href'), date: $(this).children('span').text().replace(/ /g, '')});
        }
      });

      return res.status(200).json({
        "version": "2.0",
        "template": {
          "outputs": [
            {
              "listCard": {
                "header": {
                  "title": "공지사항",
                  "imageUrl": "http://k.kakaocdn.net/dn/xsBdT/btqqIzbK4Hc/F39JI8XNVDMP9jPvoVdxl1/2x1.jpg"
                },
                "items": [
                  {
                    "title": `${noticeArray[0].title}`,
                    "description": `${noticeArray[0].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[0].url}`
                    }
                  },
                  {
                    "title": `${noticeArray[1].title}`,
                    "description": `${noticeArray[1].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[1].url}`
                    }
                  },
                  {
                    "title": `${noticeArray[2].title}`,
                    "description": `${noticeArray[2].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[2].url}`
                    }
                  },
                  {
                    "title": `${noticeArray[3].title}`,
                    "description": `${noticeArray[3].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[3].url}`
                    }
                  },
                  {
                    "title": `${noticeArray[4].title}`,
                    "description": `${noticeArray[4].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[4].url}`
                    }
                  }
                ],
                "buttons": [
                  {
                    "label": "공지사항 더보기",
                    "action": "webLink",
                    "webLinkUrl": "http://m.gachon.ac.kr/gachon/notice.jsp?boardType_seq=358"
                  }
                ]
              }
            }
          ]
        }
      });
  });
}

function scholarParse (req, res) {
  console.log('블록아이디'+req.body.userRequest.block.id);
  let url = 'http://m.gachon.ac.kr/gachon/notice.jsp?boardType_seq=361';

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }
      let noticeArray = [];

      $('#contnet > div.list > ul > li').each(function (idx) {
        if($(this).children('img').attr('alt') === '공지') {

        } else {
          noticeArray.push({title: $(this).children('a').text().trim().replace(/\n/g, ' '), url: 'http://m.gachon.ac.kr/gachon/'+$(this).children('a').attr('href'), date: $(this).children('span').text().replace(/ /g, '')});
        }
      });

      return res.status(200).json({
        "version": "2.0",
        "template": {
          "outputs": [
            {
              "listCard": {
                "header": {
                  "title": "장학소식",
                  "imageUrl": "http://k.kakaocdn.net/dn/xsBdT/btqqIzbK4Hc/F39JI8XNVDMP9jPvoVdxl1/2x1.jpg"
                },
                "items": [
                  {
                    "title": `${noticeArray[0].title}`,
                    "description": `${noticeArray[0].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[0].url}`
                    }
                  },
                  {
                    "title": `${noticeArray[1].title}`,
                    "description": `${noticeArray[1].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[1].url}`
                    }
                  },
                  {
                    "title": `${noticeArray[2].title}`,
                    "description": `${noticeArray[2].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[2].url}`
                    }
                  },
                  {
                    "title": `${noticeArray[3].title}`,
                    "description": `${noticeArray[3].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[3].url}`
                    }
                  },
                  {
                    "title": `${noticeArray[4].title}`,
                    "description": `${noticeArray[4].date}`,
                    "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                    "link": {
                      "web": `${noticeArray[4].url}`
                    }
                  }
                ],
                "buttons": [
                  {
                    "label": "장학소식 더보기",
                    "action": "webLink",
                    "webLinkUrl": "http://m.gachon.ac.kr/gachon/notice.jsp?boardType_seq=361"
                  }
                ]
              }
            }
          ]
        }
      });
  });
}

function foodRanking (req, res) {
  console.log('블록아이디'+req.body.userRequest.block.id);
  models.Food.findAll({
    limit: 5,
    order: [
        // Will escape username and validate DESC against a list of valid direction parameters
        ['like', 'DESC']
    ]
  }).then(food => {
      console.log(food);
      if (food){
          return res.status(200).json({
            "version": "2.0",
            "template": {
              "outputs": [
                {
                  "simpleText": {
                    "text": "좋아요 랭킹 상위 5개 맛집입니다!"
                  }
                },
                {
                  "carousel": {
                    "type": "basicCard",
                    "items": [
                      {
                        "title": `${food[0].name}`,
                        "description": `${food[0].detail}`,
                        "thumbnail": {
                          "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                        },
                        "buttons": [
                          {
                            "action": "phone",
                            "label": "전화걸기",
                            "phoneNumber": `${food[0].number}`
                          },
                          {
                            "action":  "webLink",
                            "label": "위치보기",
                            "webLinkUrl": `https://map.naver.com/index.nhn?query=가천대 ${food[0].name}&tab=1`
                          }
                        ]
                      },
                      {
                        "title": `${food[1].name}`,
                        "description": `${food[1].detail}`,
                        "thumbnail": {
                          "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                        },
                        "buttons": [
                          {
                            "action": "phone",
                            "label": "전화걸기",
                            "phoneNumber": `${food[1].number}`
                          },
                          {
                            "action":  "webLink",
                            "label": "위치보기",
                            "webLinkUrl": `https://map.naver.com/index.nhn?query=가천대 ${food[1].name}&tab=1`
                          }
                        ]
                      },
                      {
                        "title": `${food[2].name}`,
                        "description": `${food[2].detail}`,
                        "thumbnail": {
                          "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                        },
                        "buttons": [
                          {
                            "action": "phone",
                            "label": "전화걸기",
                            "phoneNumber": `${food[2].number}`
                          },
                          {
                            "action":  "webLink",
                            "label": "위치보기",
                            "webLinkUrl": `https://map.naver.com/index.nhn?query=가천대 ${food[2].name}&tab=1`
                          }
                        ]
                      },
                      {
                        "title": `${food[3].name}`,
                        "description": `${food[3].detail}`,
                        "thumbnail": {
                          "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                        },
                        "buttons": [
                          {
                            "action": "phone",
                            "label": "전화걸기",
                            "phoneNumber": `${food[3].number}`
                          },
                          {
                            "action":  "webLink",
                            "label": "위치보기",
                            "webLinkUrl": `https://map.naver.com/index.nhn?query=가천대 ${food[3].name}&tab=1`
                          }
                        ]
                      },
                      {
                        "title": `${food[4].name}`,
                        "description": `${food[4].detail}`,
                        "thumbnail": {
                          "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                        },
                        "buttons": [
                          {
                            "action": "phone",
                            "label": "전화걸기",
                            "phoneNumber": `${food[4].number}`
                          },
                          {
                            "action":  "webLink",
                            "label": "위치보기",
                            "webLinkUrl": `https://map.naver.com/index.nhn?query=가천대 ${food[4].name}&tab=1`
                          }
                        ]
                      },
                    ]
                  }
                }
              ]
            }
          });
      } else {
          // Return when no data found
          return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
      }
  }).catch(function (err){
    return res.status(500).json({success: false, message: 'Internal Server or Database Error. err: ' + err.message})
  });
}

// blockId: 5c616cd7384c553f07cd288a
function foodInit (req, res) {
  console.log('블록아이디'+req.body.userRequest.block.id);
  models.sequelize.query(`SELECT count(*) as count FROM food;`).then(cnt => {
    return res.status(200).json({
      "version": "2.0",
      "template": {
        "outputs": [
          {
            "simpleText": {
              "text": `현재 ${cnt[0][0].count}개의 음식점이 등록되어있습니다! 원하시는 음식종류를 선택해주세요!`
            }
          },
        ],
        "quickReplies": [
            {
              "action": "block",
              "label": "한식",
              "messageText": "한식",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "한식"
              }
            },
            {
              "action": "block",
              "label": "한식2",
              "messageText": "한식2",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "한식2"
              }
            },
            {
              "action": "block",
              "label": "분식",
              "messageText": "분식",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "분식"
              }
            },
            {
              "action": "block",
              "label": "일식",
              "messageText": "일식",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "일식"
              }
            },
            {
              "action": "block",
              "label": "양식",
              "messageText": "양식",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "양식"
              }
            },
            {
              "action": "block",
              "label": "중식",
              "messageText": "중식",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "중식"
              }
            },
            {
              "action": "block",
              "label": "돈까스",
              "messageText": "돈까스",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "돈까스"
              }
            },
            {
              "action": "block",
              "label": "도시락",
              "messageText": "도시락",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "도시락"
              }
            },
            {
              "action": "block",
              "label": "기타",
              "messageText": "기타",
              "blockId": "5c6173795f38dd5839236bb4",
              "extra": {
                "food_type": "기타"
              }
            },
        ]
      }
    });
  }).catch(function (err){
    return res.status(500).json({success: false, message: 'Internal Server or Database Error. err: ' + err.message})
  });
}

function foodByType (req, res) {
  console.log('블록아이디'+req.body.userRequest.block.id); //5c6173795f38dd5839236bb4
  console.log('엑스트라'+req.body.action.clientExtra.food_type); //5c6173795f38dd5839236bb4
  const food_type = req.body.action.clientExtra.food_type;
  models.Food.findAll({
    limit: 10,
    where: {
        type: food_type
    },
    order: [
        // Will escape username and validate DESC against a list of valid direction parameters
        ['like', 'DESC']
    ]
  }).then(food => {
      console.log(food);
      if (food){
          return res.status(200).json(jsonHelper.sendCarousel(`가천대 주변의 ${food_type}맛집 리스트입니다! 해당 음식점이름 버튼을 클릭해서 상세정보를 확인해보세요!`, food));
      } else {
          // Return when no data found
          return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
      }
  }).catch(function (err){
    return res.status(500).json({success: false, message: 'Internal Server or Database Error. err: ' + err.message})
  });
}

function getWeather (req, res) {
  models.Weather.findOne({
    order: [
        // Will escape username and validate DESC against a list of valid direction parameters
        ['id', 'DESC']
    ]
  }).then(weather => {
      console.log(weather);
      if (weather){
          return res.status(200).json({
            "version": "2.0",
            "template": {
              "outputs": [
                {
                  "simpleText": {
                    "text": `${weather.time} 기준 가천대학교의 날씨입니다!`
                  }
                },
                {
                  "carousel": {
                    "type": "basicCard",
                    "items": [
                      {
                        "title": `${weather.name}`,
                        "description": `현재기온: ${weather.tc} ℃\n오늘의 최저기온: ${weather.tmin} ℃\n오늘의 최고기온: ${weather.tmax} ℃\n습도: ${weather.humidity} %`,
                        "thumbnail": {
                          "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                        },
                      },
                    ]
                  }
                }
              ],
              "quickReplies": []
            }
          });
      } else {
          // Return when no data found
          return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
      }
  }).catch(function (err){
    return res.status(500).json({success: false, message: 'Internal Server or Database Error. err: ' + err.message})
  });
}

function getAir (req, res) {
  models.Air.findOne({
    order: [
        // Will escape username and validate DESC against a list of valid direction parameters
        ['id', 'DESC']
    ]
  }).then(air => {
      console.log(air);
      if (air){
        let pm10grade;
        let pm25grade;
        switch (air.grade_10) {
          case 1:
            pm10grade = '좋음';
          break;
          case 2:
            pm10grade = '보통';
          break;
          case 3:
            pm10grade = '나쁨';
          break;
          case 4:
            pm10grade = '매우나쁨';
          break;
        }
        switch (air.grade_25) {
          case 1:
            pm25grade = '좋음';
          break;
          case 2:
            pm25grade = '보통';
          break;
          case 3:
            pm25grade = '나쁨';
          break;
          case 4:
            pm25grade = '매우나쁨';
          break;
        }
          return res.status(200).json({
            "version": "2.0",
            "template": {
              "outputs": [
                {
                  "simpleText": {
                    "text": `${air.time} 기준 미세먼지 지수입니다!(상대원동 측정소)`
                  }
                },
                {
                  "carousel": {
                    "type": "basicCard",
                    "items": [
                      {
                        "title": `${pm10grade}`,
                        "description": `미세먼지 지수: ${air.pm_10} (pm10)\n\n초미세먼지: ${pm25grade}\n초미세먼지 지수: ${air.pm_25} (pm25)`,
                        "thumbnail": {
                          "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                        },
                      },
                    ]
                  }
                }
              ],
              "quickReplies": []
            }
          });
      } else {
          // Return when no data found
          return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
      }
  }).catch(function (err){
    return res.status(500).json({success: false, message: 'Internal Server or Database Error. err: ' + err.message})
  });
}

// blockID: 5c64110de8212717d2bfaabc
function foodDetail (req, res) {
  const food_id = req.body.action.clientExtra.food_id;
  models.Food.findOne({
    where: {
        id: food_id
    }
  }).then(food => {
      console.log(food);
      if (food){
          return res.status(200).json({
            "version": "2.0",
            "template": {
              "outputs": [
                {
                  "carousel": {
                    "type": "basicCard",
                    "items": [
                      {
                        "title": `${food.name}`,
                        "description": `${food.detail}`,
                        "thumbnail": {
                          "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                        },
                        "buttons": [
                          {
                            "action": "block",
                            "label": `👍 ${food.like}`,
                            "messageText": `👍`,
                            "blockId": '5c641ae35f38dd5839237e30'
                          },
                          {
                            "action": "phone",
                            "label": "전화걸기",
                            "phoneNumber": `${food.number}`
                          },
                          {
                            "action":  "webLink",
                            "label": "위치보기",
                            "webLinkUrl": `https://map.naver.com/index.nhn?query=가천대 ${food.name}&tab=1`
                          }
                        ]
                      },
                    ]
                  }
                }
              ],
              "quickReplies": [
                {
                  "action": "block",
                  "label": "좋아요👍",
                  "messageText": `${food.name} 좋아요👍`,
                  "blockId": "5c64175b384c553f07cd3850",
                  "extra": {
                    "food_id": `${food_id}`
                  }
                },
                {
                  "action": "block",
                  "label": "이전",
                  "messageText": `${food.type} 맛집 리스트!`,
                  "blockId": "5c6173795f38dd5839236bb4",
                  "extra": {
                    "food_type": `${food.type}`
                  }
                },
                {
                  "action": "block",
                  "label": "🏠",
                  "messageText": `🏠`,
                  "blockId": "5c6173795f38dd5839236bb4",
                },
              ],
            }
          });
      } else {
          // Return when no data found
          return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
      }
  }).catch(function (err){
    return res.status(500).json({success: false, message: 'Internal Server or Database Error. err: ' + err.message})
  });
}

// blockID: 5c64175b384c553f07cd3850
function foodLike (req, res) {
  const food_id = req.body.action.clientExtra.food_id;
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
      }).then(result => {
          if (result){
              return res.status(200).json({
                "version": "2.0",
                "template": {
                  "outputs": [
                    {
                      "simpleText": {
                        "text": `${food.name} 좋아요 완료!`
                      }
                    },
                  ],
                  "quickReplies": [
                    {
                      "action": "block",
                      "label": "이전",
                      "messageText": `${food.name}`,
                      "blockId": "5c64110de8212717d2bfaabc",
                      "extra": {
                        "food_id": `${food_id}`
                      }
                    },
                    {
                      "action": "block",
                      "label": "🏠",
                      "messageText": `🏠`,
                      "blockId": "5c6173795f38dd5839236bb4",
                    },
                  ],
                }
              })
          } else {
              return res.status(403).json({success: true, message: 'No user found to update or User does not exist with given kakao_id. ' +
                  + result.toString()})
          }
      }).catch(function (err){
        return res.status(500).json({success: false, message: 'Internal Server or Database Error. err: ' + err.message})
      });
    } else {
      return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
    }
  }).catch(function (err){
    return res.status(500).json({success: false, message: 'Internal Server or Database Error. err: ' + err.message})
  });
}

// blockID: 5c641ae35f38dd5839237e30
function failLike (req, res) {
  console.log('블록아이디'+req.body.userRequest.block.id);
  return res.status(200).json({
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `좋아요는 다음과 같은 카드의 하단 버튼을 통해 이용하실 수 있습니다!`
          }
        },
        {
          "simpleImage": {
              "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg",
              "altText": "좋아요"
          }
        }
      ],
      "quickReplies": [
        {
          "action": "block",
          "label": "맛집리스트",
          "blockId": "5c616cd7384c553f07cd288a",
        },
        {
          "action": "block",
          "label": "🏠",
          "messageText": `🏠`,
          "blockId": "5c6173795f38dd5839236bb4",
        },
      ],
    }
  })
}


module.exports = {
    test: test,
    posttest: posttest,
    schoolFoodArt: schoolFoodArt,
    schoolFoodVision: schoolFoodVision,
    schoolFoodEdu: schoolFoodEdu,
    libraryRestSeat: libraryRestSeat,
    noticeParse: noticeParse,
    scholarParse: scholarParse,
    foodParser: foodParser,
    foodRanking: foodRanking,
    foodInit: foodInit,
    foodByType: foodByType,
    getWeather: getWeather,
    getAir: getAir,
    foodDetail: foodDetail,
    foodLike: foodLike,
    failLike: failLike,


}
