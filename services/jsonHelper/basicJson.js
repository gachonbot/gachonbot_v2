function sendHomeMenu () {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `안녕하세요! 가천봇입니다 :)`
          }
        },
        {
          "carousel": {
            "type": "basicCard",
            "items": [
              {
                "thumbnail": {
                  "imageUrl": "https://s3.ap-northeast-2.amazonaws.com/gachonbot/main1.png"
                },
                "buttons": [
                  {
                    "action":  "block",
                    "label": "학사 메뉴",
                    "messageText": `학사 메뉴`,
                    "blockId": `5c6acb2f384c5541a0ee5bc1`,
                  },
                  {
                    "action":  "block",
                    "label": "공지사항",
                    "messageText": `공지사항`,
                    "blockId": `5c612dd75f38dd5839236a18`,
                  },
                  {
                    "action":  "block",
                    "label": "다음 무당이?",
                    "messageText": `다음 무당이?`,
                    "blockId": `5c682e48384c5541a0ee51da`,
                  }
                ]
              },
              {
                "thumbnail": {
                  "imageUrl": "https://s3.ap-northeast-2.amazonaws.com/gachonbot/main2.png"
                },
                "buttons": [
                  {
                    "action":  "block",
                    "label": "실시간 날씨",
                    "messageText": "실시간 날씨",
                    "blockId": `5c62b860384c553f07cd321c`,
                  },
                  {
                    "action":  "block",
                    "label": "실시간 미세먼지",
                    "messageText": "실시간 미세먼지",
                    "blockId": `5c62bc8a05aaa7668df7d184`,
                  },
                  {
                    "action":  "block",
                    "label": "도서관 자리현황",
                    "messageText": "도서관 자리현황",
                    "blockId": `5c66836ae821274ba7892e1d`,
                  }
                ]
              },
              {
                "thumbnail": {
                  "imageUrl": "https://s3.ap-northeast-2.amazonaws.com/gachonbot/main3.png"
                },
                "buttons": [
                  {
                    "action":  "block",
                    "label": "맛집 메뉴",
                    "messageText": `맛집 메뉴`,
                    "blockId": `5c6accb505aaa75509ea69c8`,
                  },
                  {
                    "action":  "block",
                    "label": "오늘 뭐 먹지?",
                    "messageText": `오늘 뭐 먹지?`,
                    "blockId": `5c700e38e821274ba78960f3`,
                  },
                  {
                    "action":  "block",
                    "label": "오늘의 식단(학식)",
                    "messageText": `오늘의 식단(학식)`,
                    "blockId": `5c612b6905aaa7668df7bfc1`,
                  }
                ]
              },
            ]
          }
        }
      ],
      "quickReplies": [
      ],
    }
  };
}

function sendSimpleText (text) {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `${text}`
          }
        },
      ],
      "quickReplies": [
        {
          "action": "block",
          "label": "🏠",
          "messageText": `🏠`,
          "blockId": "5c66b0f65f38dd01ebc06a44",
        },
      ],
    }
  };
}

function sendNoMajor () {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `학과 설정이 되어있지 않아요...! 학과 설정을 해주세요!`
          }
        },
      ],
      "quickReplies": [
        {
          "action": "block",
          "label": "🏠",
          "messageText": `🏠`,
          "blockId": "5c66b0f65f38dd01ebc06a44",
        },
        {
          "action": "block",
          "label": "학과 설정",
          "messageText": `학과 설정하기`,
          "blockId": "5c6986d45f38dd01ebc06dd8",
        },
      ],
    }
  };
}

module.exports = {
  sendHomeMenu: sendHomeMenu,
  sendSimpleText: sendSimpleText,
  sendNoMajor: sendNoMajor,
}
