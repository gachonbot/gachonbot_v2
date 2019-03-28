require('dotenv').config()
const client = require('cheerio-httpcli');
const moment = require('moment');
const schedule = require('node-schedule');
const models = require('../../models');
const rp = require('request-promise');
const jsonHelper = require('../jsonHelper');
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const cheerio = require('cheerio');
const fs = require('fs');
const {Tagger} = require('koalanlp/proc');
const {EUNJEON} = require('koalanlp/API');
const {initialize} = require('koalanlp/Util');
const Hangul = require('hangul-js');
const _ = require('underscore');
const path = require("path");

const param = {};
client.set('headers', {           // 크롤링 방지 우회를 위한 User-Agent setting
  'data-useragent' : 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
  'Accept-Charset': 'utf-8'
});

let weather_scheduler = schedule.scheduleJob('5 * * * *', function(){
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
      .catch(err => {
          console.log(err);
      });
});

let air_scheduler = schedule.scheduleJob('25 * * * *', function(){
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
      .catch(err => {
          console.log(err);
      });
});

function foodParser (req, res) {
  let placeParam = (req.body.action.params.place);
  let url = 'http://m.gachon.ac.kr/menu/menu.jsp';
  let image = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/art.png';
  let foodResult;

  switch (placeParam) {
    case '교육대학원':
      url = 'http://m.gachon.ac.kr/menu/menu.jsp?gubun=B';
      image = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/areum.png'
    break;
    case '비전타워':
      url = 'http://m.gachon.ac.kr/menu/menu.jsp?gubun=C';
      image = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/vision.png'
    break;
    case '기숙사':
      url = 'http://ace.gachon.ac.kr/dormitory/reference/menu#container';
      image = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/giusk.png'
    break;
  }

  const day = moment().day();

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }

      if (placeParam === '기숙사') {
        if (day === 0) {
          day = 7;
        }
        let foodSelector = $(`#container > div.substance > div.sub_contents > table > tbody > tr:nth-child(${day})`);
        foodResult = `${$(foodSelector).children('th').text().trim()}\n\n아침\n${$(foodSelector).children('td').first().text().trim()}\n\n점심\n${$(foodSelector).children('td').last().prev().text().trim()}\n\n저녁\n${$(foodSelector).children('td').last().text().trim()}`;
      } else {
        foodResult = $(`#toggle-view > li:nth-child(${day}) > dl`).text().trim();
        if (day === 0) {
          foodResult = '주말에는 운영하지 않아요!';
        }
      }

      return res.status(200).json(jsonHelper.schoolJson.sendFoodParser(foodResult, image));
  });
}

// 5c612d2b5f38dd58392369f1
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

      return res.status(200).json(jsonHelper.schoolJson.sendLibraryRestSeat(restSeat, totalSeat));
  });
}

function noticeParse (req, res) {
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
          noticeArray.push({title: $(this).children('a').text().trim().replace(/\n/g, ' ').replace('               ',' '), url: 'http://m.gachon.ac.kr/gachon/'+$(this).children('a').attr('href'), date: $(this).children('span').text().replace(/ /g, '')});
        }
      });

      return res.status(200).json(jsonHelper.schoolJson.sendNoticeParse(noticeArray));
  });
}

function scholarParse (req, res) {
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
          noticeArray.push({title: $(this).children('a').text().trim().replace(/\n/g, ' ').replace('               ',' '), url: 'http://m.gachon.ac.kr/gachon/'+$(this).children('a').attr('href'), date: $(this).children('span').text().replace(/ /g, '')});
        }
      });

      return res.status(200).json(jsonHelper.schoolJson.sendScholarParse(noticeArray));
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
        const weatherName = weather.name;
        let weatherImage = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/weather.png';
        switch (weatherName) {
          case '맑음':
            weatherImage = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/sunny.jpg';
          break;
          case '구름조금':
            weatherImage = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/cloudy.jpg';
          break;
          case '구름많음':
            weatherImage = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/cloudy.jpg';
          break;
          case '흐림':
            weatherImage = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/foggy.jpg';
          break;
        }
        if (weatherName.includes('비')) {
          weatherImage = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/rainy.jpg';
        } else if(weatherName.includes('눈')) {
          weatherImage = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/snowy.jpg';
        }
          return res.status(200).json(jsonHelper.schoolJson.sendGetWeather(weather, weatherImage));
      } else {
          console.log(err.message);
          return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
      }
  }).catch(err => {
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

function getAir (req, res) {
  models.Air.findOne({
    order: [
        // Will escape username and validate DESC against a list of valid direction parameters
        ['id', 'DESC']
    ]
  }).then(air => {
      if (air){
        let pm10grade;
        let pm25grade;
        let image = 'https://s3.ap-northeast-2.amazonaws.com/gachonbot/dust.jpg';
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
          return res.status(200).json(jsonHelper.schoolJson.sendGetAir(air, pm10grade, pm25grade, image));
      } else {
          // Return when no data found
          console.log(err.message);
          return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
      }
  }).catch(err => {
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

//5c66836ae821274ba7892e1d
function libraryInit (req, res) {
  return res.status(200).json(jsonHelper.schoolJson.sendLibraryInit());
}

// 5c66811f384c5541a0ee4f87
function elecLibraryInit (req, res) {
  return res.status(200).json(jsonHelper.schoolJson.sendElecLibraryInit());
}


//5c6680c305aaa75509ea57ec
function elecLibrary1F (req, res) {
  (async function getRestSeat() {
    const driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless')).build();
    try {
      await driver.get('http://dlibadm.gachon.ac.kr/GACHON_BOOKING/webbooking/seatList.jsp?typeNo=2&floor=1&roomCode=111&sectorCode=11101&bgImg=area11101.gif');
      await driver.findElement(By.id('timeset')).sendKeys("0");
      await driver.findElement(By.className('cssButton1')).click();
      await driver.switchTo().frame("seatMap");
      driver.getPageSource().then(function(title) {
        const $ = cheerio.load(title);
        let img = [];
        $('img').each(function(){
          if ($(this).attr('src') === '/GACHON_BOOKING/korea/images/seat/Btn1.png') {
            img.push(true);
          } else if ($(this).attr('src') === '/GACHON_BOOKING/korea/images/seat/Btn_disable1.png') {
            img.push(false);
          }
        });
        let notebook = 0;
        let infoSearch = 0;
        let congressEdit = 0;
        let multiEdit = 0;
        let multiView = 0;
        img.forEach(function(data, index) {
          if (data === false) {
            if(index > 69) { //노트북열람석
              notebook += 1;
            } else if (index > 37) { //정보검색
              infoSearch += 1;
            } else if (index > 29) { //국회자료편집
              congressEdit += 1;
            } else if (index > 21) { //멀티미디어편집
              multiEdit += 1;
            } else {
              multiView += 1;
            }
          }
        });
        return res.status(200).json(jsonHelper.schoolJson.sendElecLibrary1F(multiView, multiEdit, congressEdit, infoSearch, notebook));
      });
    } catch(err) {
      console.log(err);
      return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
    } finally {
      await driver.close();
      await driver.quit();
    }
  })();
}

//5c66810b5f38dd01ebc06976
function elecLibrary2F (req, res) {
  const driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless')).build();
  (async function getRestSeat() {
    try {
      await driver.get('http://dlibadm.gachon.ac.kr/GACHON_BOOKING/webbooking/seatList.jsp?typeNo=1&floor=2&roomCode=121&sectorCode=12101&bgImg=area12101.gif');
      await driver.findElement(By.id('timeset')).sendKeys("0");
      await driver.findElement(By.className('cssButton1')).click();
      await driver.switchTo().frame("seatMap");
      driver.getPageSource().then(function(title){
        const $ = cheerio.load(title);
        let img = [];
        $('img').each(function(){
          if ($(this).attr('src') === '/GACHON_BOOKING/korea/images/seat/Btn1.png') {
            img.push(true);
          } else if ($(this).attr('src') === '/GACHON_BOOKING/korea/images/seat/Btn_disable1.png') {
            img.push(false);
          }
        });
        let notebook = 0;
        let general = 0;
        img.forEach(function(data, index) {
          if (data === false) {
            if(index > 53) { //일반열람석
              general += 1;
            } else {
              notebook += 1;
            }
          }
        });
        return res.status(200).json(jsonHelper.schoolJson.sendElecLibrary2F(general, notebook));
      });
    } catch(err) {
      console.log(err.message);
      return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
    } finally {
      await driver.close();
      await driver.quit();
    }
  })();
}

// 5c682e48384c5541a0ee51da
function moodang (req, res) {
  let timeArray = [840,845,855,900,915,930,945,1000,1015,1030,1045,1100,1115,1130,1145,1300,1315,1330,1345,1400,1415,1430,1445,1500,1515,1530,1545,1600,1615,1630,1645,1700,1715];
  let timeNow = moment().format('HHmm');
  let dayNow = moment().day();

  let result = timeArray.reduce((acc,cur) => {
    if(timeNow > cur){

    } else {
      if ((cur - timeNow < acc[0])) {
        acc[0] = cur-timeNow;
        acc[1] = cur;
      }
    }
    return acc;
  },[9999]);

  let finalTime = String(result[1]);

  if(finalTime.length === 3){
    finalTime = finalTime.slice(0,1)+'시'+finalTime.slice(1)+'분';
  }else{
    finalTime = finalTime.slice(0,2)+'시'+finalTime.slice(2)+'분';
  }

  models.Weather.findOne({
    order: [
        // Will escape username and validate DESC against a list of valid direction parameters
        ['id', 'DESC']
    ]
  }).then(weather => {
      if (weather){
        if (dayNow === 6 || dayNow === 0) {
          return res.status(200).json(jsonHelper.basicJson.sendSimpleText('주말에는 운영하지 않아요ㅠㅠㅠ'));
        } else {
          if (weather.name.includes('눈') || weather.name.includes('비') || weather.name.includes('뇌우')) {
            return res.status(200).json(jsonHelper.basicJson.sendSimpleText(`다음 무당이 시간은 ${finalTime} 인데... ${weather.name} 때문에 운행을 안 할수도 있어요!`));
          } else if (result[0] === 9999) {
            return res.status(200).json(jsonHelper.basicJson.sendSimpleText('오늘은 더 이상 운영하지 않아요...!'));
          } else {
            return res.status(200).json(jsonHelper.basicJson.sendSimpleText(`다음 무당이 시간은 ${finalTime} 입니다!`));
          }
        }
      } else {
          // Return when no data found
          console.log(err.message);
          return res.status(403).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
      }
  }).catch(err => {
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

// 5c6986d45f38dd01ebc06dd8
function selectCollege (req,res) {
  return res.status(200).json(jsonHelper.schoolJson.sendCollege());
}

// 5c69875de821274ba78931b6
function selectMajor (req,res) {
  const college = req.body.action.clientExtra.college;

  switch (college) {
    case '경영대학':
      return res.status(200).json(jsonHelper.schoolJson.sendMajor(college,'경영학부','글로벌경영학트랙'));
    break;
    case '사회과학대학':
      return res.status(200).json(jsonHelper.schoolJson.sendMajor(college,'행정학과','미디어커뮤니케이션학과','관광경영학과','글로벌경제학과','헬스케어경영학과','응용통계학과','사회복지학과','유아교육학과','경찰학연계전공'));
    break;
    case '인문대학':
      return res.status(200).json(jsonHelper.schoolJson.sendMajor(college,'한국어문학과','영미어문학과','동양어문학과','유럽어문학과'));
    break;
    case '법과대학':
      return res.status(200).json(jsonHelper.schoolJson.sendMajor(college,'법학과','경찰안보학과'));
    break;
    case '공과대학':
      return res.status(200).json(jsonHelper.schoolJson.sendEngiMajor());
    break;
    case '공과대학2':
      return res.status(200).json(jsonHelper.schoolJson.sendEngiMajorSecond());
    break;
    case '바이오나노대학':
      return res.status(200).json(jsonHelper.schoolJson.sendMajor(college,'바이오나노학과','나노화학과','나노물리학과','생명과학과','식품생물공학과','식품영양학과'));
    break;
    case 'IT대학':
      return res.status(200).json(jsonHelper.schoolJson.sendMajor(college,'소프트웨어학과','컴퓨터공학과','전자공학과','에너지IT학과'));
    break;
    case '한의과대학':
      return res.status(200).json(jsonHelper.schoolJson.sendMajor(college,'한의예과','한의학과'));
    break;
    case '예술대학':
      return res.status(200).json(jsonHelper.schoolJson.sendMajor(college,'회화,조소과','산업디자인과','패션디자인과','음악학부','체육학부','연기예술학과'));
    break;
  }
}

// 5c697eab05aaa75509ea5cbe
function updateMajor (req,res) {
  const user_id = req.body.userRequest.user.id;
  const major = req.body.action.clientExtra.major;

  models.User.findOrCreate({
    where: {
        bot_id: user_id
    }
  }).spread((user, created) => {
    models.User.update(
      {
        major: major,
      },     // What to update
      {where: {
              bot_id: user_id}
      }).then(result => {
        return res.status(200).json(jsonHelper.basicJson.sendSimpleText(`정보가 업데이트되었습니다!`));
      }).catch(err => {
        console.log(err.message);
        return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
      });
  }).catch(err => {
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

// 5c6aa735384c5541a0ee5b81
function majorNoticeParse (req,res) {
  const user_id = req.body.userRequest.user.id;

  models.User.findOrCreate({
    where: {
        bot_id: user_id
    }
  }).spread((user, created) => {
    const userMajor = user.major;
    if (userMajor) {
      models.Major.findOne({
        where: {
            name: userMajor
        },
      }).then(major => {
          if (major){
            const url = major.notice;

            client.fetch(url, param, function(err, $, resp){
                if(err){
                    console.log(err);
                    return;
                }
                let noticeArray = [];

                switch (userMajor) {
                  case '소프트웨어학과':
                    $('#pc6bd6e4f05 > table > tbody > tr').each(function (idx) {
                        noticeArray.push({title: $(this).children('.title').children('a').text().trim().replace(/\n/g, ' '), url: 'https://sw.gachon.ac.kr/cms/?p=30&idx='+$(this).children('.title').children('a').attr('data-idx'), date: $(this).children('.date').text().trim().replace(/ /g, '')});
                    });
                  break;
                  case '글로벌경영학트랙':
                    $('#container > div > div.sub_stance.com_cont01 > div > table > tbody > tr').each(function (idx) {
                        noticeArray.push({title: $(this).children('.td_left').children('a').text().trim().replace(/\n/g, ' '), url: 'http://ace.gachon.ac.kr'+$(this).children('.td_left').children('a').attr('href'), date: $(this).children().last().prev().text().replace(/ /g, '')});
                    });
                  break;
                  case '회화,조소과': case '음악학부': case '체육학부': case '연기예술학과':
                    return res.status(200).json(jsonHelper.basicJson.sendSimpleText(`지원하지 않는 학과입니다!`));
                  break;
                  default:
                    $('#content > form > div > table > tbody > tr').each(function (idx) {
                      if($(this).children().first().children('img').attr('alt') === '공지') {

                      } else {
                        noticeArray.push({title: $(this).children('.tl').children('a').text().trim().replace(/\n/g, ' '), url: 'http://www.gachon.ac.kr/major/'+$(this).children('.tl').children('a').attr('href'), date: $(this).children().last().prev().text().replace(/ /g, '')});
                      }
                    });
                  break;
                }

                return res.status(200).json(jsonHelper.schoolJson.sendMajorNoticeParse(userMajor, noticeArray, major));
            });
          } else {
            // major 없을 때
            return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
          }
      }).catch(function (err){
        console.log(err.message);
        return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
      });
    } else {
      //학과가 설정되어있지 않을 때
      return res.status(200).json(jsonHelper.basicJson.sendNoMajor());
    }
  }).catch(err => {
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

// 5c6ab205e821274ba7893ab5
function majorParse (req,res) {
  const user_id = req.body.userRequest.user.id;

  models.User.findOrCreate({
    where: {
        bot_id: user_id
    }
  }).spread((user, created) => {
    const userMajor = user.major;
    if (userMajor) {
      if (userMajor === '회화,조소과' || userMajor === '음악학부' || userMajor ==='체육학부' || userMajor ==='연기예술학과') {
        return res.status(200).json(jsonHelper.basicJson.sendSimpleText(`지원하지 않는 학과입니다!`));
      } else {
        models.Major.findOne({
          where: {
              name: userMajor
          },
        }).then(major => {
            if (major){
              return res.status(200).json(jsonHelper.schoolJson.sendMajorParse(userMajor, major));
            } else {
              // major 없을 때
              return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
            }
        }).catch(function (err){
          console.log(err.message);
          return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
        });
      }
    } else {
      // 학과가 설정되어있지 않을 때
      return res.status(200).json(jsonHelper.basicJson.sendNoMajor());
    }
  }).catch(err => {
    console.log(err.message);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

//
function searchSchedule (req,res) {
  const inputText = (req.body.action.params.schedule);
  let dict = fs.readFileSync(path.resolve(__dirname, '../jsonHelper/noun.json'));
  dict = JSON.parse(dict);

  function levenshtein_distance_b (s, t) {
        if (!s.length) return t.length;
        if (!t.length) return s.length;

        return Math.min(
            levenshtein_distance_b(s.substr(1), t) + 1,
            levenshtein_distance_b(t.substr(1), s) + 1,
            levenshtein_distance_b(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
        );
  }

  function count_similarities(arrayA, arrayB) {
      var matches = 0;
      for (i=0;i<arrayA.length;i++) {
          if (arrayB.indexOf(arrayA[i]) != -1)
              matches++;
      }
      return parseFloat(matches) / parseFloat(arrayB.length);
  }

  (async function someAsyncFunction(){
      let tagger = new Tagger(EUNJEON);
      let result = await tagger(inputText);

      console.log(result[0].singleLineString()); // "문단을 분석합니다."의 품사분석 결과 출력


      let resultArray = [];
      result = result[0];
      result.forEach(data => {
        data._items.forEach(data2 => {
          if(data2._tag === "NNG" || data2._tag === "NNP") {
            resultArray.push(data2._surface);
          }
        });
      });
      console.log(inputText);
      console.log(resultArray);
      resultArray.forEach((data,idx) => {
        let changed = 999;
        dict.forEach(data2 => {
          let value = levenshtein_distance_b(Hangul.disassemble(data).toString().replace(/,/g,''),Hangul.disassemble(data2).toString().replace(/,/g,''));
          if(value < changed) {
            changed = value;
            resultArray[idx] = data2;
          }
        });
      });
      console.log(resultArray);

      let sampleArray = fs.readFileSync(path.resolve(__dirname, '../jsonHelper/schedule.json'));
      sampleArray = JSON.parse(sampleArray);
      let finalResult = [];
      sampleArray.forEach(data => {
        let resultSimil = count_similarities(resultArray,data.noun);
        finalResult.push({title: data.title, date: data.date, sim: resultSimil})
      });

      return(finalResult);
  })().then(result => {
    result = result.sort((a, b) => Number(b.sim) - Number(a.sim));
    console.log(result);
    return res.status(200).json(jsonHelper.schoolJson.sendSearchSchedule(result));
  }).catch(err => {
    console.log(err);
    return res.status(500).json(jsonHelper.basicJson.sendSimpleText('오류가 발생했습니다. 다시 시도해주세요!'));
  });
}

//
function scheduleByMonthInit (req,res) {
  return res.status(200).json(jsonHelper.schoolJson.sendScheduleByMonthInit());
}

function scheduleByMonthInit2 (req,res) {
  return res.status(200).json(jsonHelper.schoolJson.sendScheduleByMonthInit2());
}

// 5c6fed245f38dd01ebc0a234
function scheduleByMonth (req,res) {
  const month = req.body.action.clientExtra.month;
  console.log(month);
  let url = 'http://m.gachon.ac.kr/day/day.jsp?boardType_seq=395';


  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }
      let result = '';
      $(`#toggle-view > li:nth-child(${month}) > div`).each(function (idx) {
        $(this).children('dl').each(function (idx2) {
          result += `${$(this).children('dd').text().trim().split('] ')[1]}\n${$(this).children('dt').text().trim()}\n\n`
        });
      });
      return res.status(200).json(jsonHelper.schoolJson.sendScheduleByMonth(month, result));
  });
}

function workParse (req, res) {
  let url = 'http://m.gachon.ac.kr/gachon/notice.jsp?boardType_seq=773';

  client.fetch(url, param, function(err, $, resp){
      if(err){
          console.log(err);
          return;
      }
      let noticeArray = [];

      $('#contnet > div.list > ul > li').each(function (idx) {
        if($(this).children('img').attr('alt') === '공지') {

        } else {
          noticeArray.push({title: $(this).children('a').text().trim().replace(/\n/g, ' ').replace('               ',' '), url: 'http://m.gachon.ac.kr/gachon/'+$(this).children('a').attr('href'), date: $(this).children('span').text().replace(/ /g, '')});
        }
      });

      return res.status(200).json(jsonHelper.schoolJson.sendWorkParse(noticeArray));
  });
}

function getUser (req, res) {
  models.User.findOne({
    where: {
        bot_id: req.body.id
    },
  }).then(user => {
      if (user){
        return res.status(200).json({result: user});
      } else {
        return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
      }
  }).catch(function (err){
    console.log(err.message);
    return res.status(500).json({success: false, message: 'error'})
  });
}

module.exports = {
    libraryRestSeat: libraryRestSeat,
    noticeParse: noticeParse,
    scholarParse: scholarParse,
    foodParser: foodParser,
    getWeather: getWeather,
    getAir: getAir,
    elecLibrary1F: elecLibrary1F,
    elecLibrary2F: elecLibrary2F,
    elecLibraryInit: elecLibraryInit,
    libraryInit: libraryInit,
    moodang: moodang,
    selectCollege: selectCollege,
    selectMajor: selectMajor,
    updateMajor: updateMajor,
    majorNoticeParse: majorNoticeParse,
    majorParse: majorParse,
    searchSchedule: searchSchedule,
    scheduleByMonthInit: scheduleByMonthInit,
    scheduleByMonthInit2: scheduleByMonthInit2,
    scheduleByMonth: scheduleByMonth,
    workParse: workParse,
    getUser: getUser,
}
