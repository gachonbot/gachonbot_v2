function sendHomeMenu () {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `👍👍설문조사 이벤트 당첨자 발표👍👍\n안녕하세요 가천봇입니다.\n지난 3월 12일부터 업데이트 기념 설문조사 이벤트를 실시했었습니다!!👌\n\n저희 예상과 다르게 매우 많은 분들이 참여해주셔서 저희도 매우 놀랐답니다!😍\n\n총 160명이 넘는 학우분들께서 설문에 참여를 해주셨고 매우 다양한 피드백과 기대사항을 확인하였습니다.\n\n저희 가천봇 팀은 이를 토대로 이번 학기중에 저희 가천대 학우분들께 이전에 경험해보지 못한 새로운 학교생활 경험을 가천봇을 통해 선사드릴 계획입니다.🙈\n\n또한 이번 설문조사 이벤트를 통하여 이벤트에 대한 폭발적인 수요를 확인하였고 추후에도 지속적인 이벤트를 이어나갈 계획입니다.\n많이 지켜봐주시고 응원 부탁드립니다.\n\n당첨자 명단(휴대폰 번호 뒷자리)\n\n최*훈 8219\n안*윤 1957\n은*    5730\n\n당첨된 분들께서는 별도로 연락드릴 예정이며 추후에도 지속적인 이벤트를 진행할 예정이니 이번에 당첨되지못한 분들께는 양해를 부탁드리겠습니다👏`
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
                    "label": "오늘의 학식",
                    "messageText": `오늘의 학식`,
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
