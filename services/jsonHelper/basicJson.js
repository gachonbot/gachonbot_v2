function sendHomeMenu () {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `가천봇과 함께 편한 학교생활을 즐겨보세요!`
          }
        },
        {
          "carousel": {
            "type": "basicCard",
            "items": [
              {
                "description": "학교 공지사항, 장학소식, 학사일정 등 다양한 소식을 볼 수 있어요!",
                "thumbnail": {
                  "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                }
              },
              {
                "description": "가천대의 실시간 날씨(미세먼지), 현재 도서관 좌석 현황, 오늘의 학식 등 실시간 정보를 확인해보세요!",
                "thumbnail": {
                  "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                }
              },
              {
                "description": "밥 먹을 곳이 고민되신다구요? 가천대 주변 음식점 정보, 사진으로 선택해보세요!",
                "thumbnail": {
                  "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
                }
              },
            ]
          }
        }
      ],
      "quickReplies": [
        {
          "action": "block",
          "label": "학사",
          "messageText": `학사`,
          "blockId": "5c6acb2f384c5541a0ee5bc1",
        },
        {
          "action": "block",
          "label": "맛집",
          "messageText": `맛집`,
          "blockId": "5c6accb505aaa75509ea69c8",
        },
        {
          "action": "block",
          "label": "날씨",
          "messageText": `현재 날씨`,
          "blockId": "5c62b860384c553f07cd321c",
        },
        {
          "action": "block",
          "label": "미세먼지",
          "messageText": `현재 미세먼지`,
          "blockId": "5c62bc8a05aaa7668df7d184",
        },
        {
          "action": "block",
          "label": "도서관 자리현황",
          "messageText": `도서관 자리현황`,
          "blockId": "5c66836ae821274ba7892e1d",
        },
        {
          "action": "block",
          "label": "학식",
          "messageText": `학식`,
          "blockId": "5c612b6905aaa7668df7bfc1",
        },
        {
          "action": "block",
          "label": "다음 무당이",
          "messageText": `다음 무당이`,
          "blockId": "5c682e48384c5541a0ee51da",
        },
        {
          "action": "block",
          "label": "학과설정",
          "messageText": `학과설정`,
          "blockId": "5c6986d45f38dd01ebc06dd8",
        },
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
          "blockId": "5c66b0f65f38dd01ebc06a44",
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
