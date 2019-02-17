function addQuickReply (name, block_id, id) {
  return {
    "action": "block",
    "label": `${name}`,
    "messageText": `${name}`,
    "blockId": `${block_id}`,
    "extra": {
      "food_id": `${id}`
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
          "blockId": "5c6173795f38dd5839236bb4",
        },
      ],
    }
  };
}



function sendCarousel(text, ...args) {
  let outputJson = {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `${text}`
          }
        },
        {
          "carousel": {
            "type": "basicCard",
            "items": [
            ]
          }
        }
      ],
      "quickReplies": []
    }
  };

  function addCarouselItem (name, detail, number){
    return {
      "title": `${name}`,
      "description": `${detail}`,
      "thumbnail": {
        "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
      },
      "buttons": [
        {
          "action": "phone",
          "label": "전화걸기",
          "phoneNumber": `${number}`
        },
        {
          "action":  "webLink",
          "label": "위치보기",
          "webLinkUrl": `https://map.naver.com/index.nhn?query=가천대 ${name}&tab=1`
        },
        {
          "action":  "share",
          "label": "공유하기",
        }
      ]
    };
  }


  for(let i = 0; i < args[0].length; i += 1) {
    outputJson.template.outputs[1].carousel.items[i] = addCarouselItem(args[0][i].name, args[0][i].detail, args[0][i].number);
    outputJson.template.quickReplies[i] = addQuickReply(args[0][i].name, '5c64110de8212717d2bfaabc', args[0][i].id);
  }

  return outputJson;
}

function sendImageCarousel(text, food_id, ...args) {
  let outputJson = {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `${text}`
          }
        },
        {
          "carousel": {
            "type": "basicCard",
            "items": [
            ]
          }
        }
      ],
      "quickReplies": []
    }
  };

  function addImageCarouselItem (url){
    return {
      "thumbnail": {
        "imageUrl": `${url}`,
        "fixedRatio": "true",
      },
      "buttons": [
        {
          "action": "share",
          "label": "공유하기",
        }
      ]
    };
  }


  for(let i = 0; i < args[0].length; i += 1) {
    outputJson.template.outputs[1].carousel.items[i] = addImageCarouselItem(args[0][i].url);
  }
  outputJson.template.quickReplies[0] = addQuickReply('이전', '5c64110de8212717d2bfaabc', food_id);
  outputJson.template.quickReplies[1] = addQuickReply('🏠', '5c64110de8212717d2bfaabc', food_id);
  return outputJson;
}

function sendMajor(text, ...args) {
  let outputJson = {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `${text} 내 해당되는 학과를 선택해주세요!`
          }
        },
      ],
      "quickReplies": [
      ],
    }
  };

  function addQuickReplyMajor (name, block_id) {
    return {
      "action": "block",
      "label": `${name}`,
      "messageText": `${name}`,
      "blockId": `${block_id}`,
      "extra": {
        "major": `${name}`
      }
    };
  }

  for(let i = 0; i < args.length; i += 1) {
    outputJson.template.quickReplies[i] = addQuickReplyMajor(args[i], '5c697eab05aaa75509ea5cbe');
  }
  outputJson.template.quickReplies[args.length] = addQuickReplyMajor('이전', '5c6986d45f38dd01ebc06dd8');

  return outputJson;

}

function sendCollege() {
  let collegeArray = ['경영대학','사회과학대학','인문대학','법과대학','공과대학','바이오나노대학','IT대학','한의과대학','예술대학'];
  let outputJson = {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `해당되는 단과대학을 선택해주세요!`
          }
        },
      ],
      "quickReplies": [
      ],
    }
  };

  function addQuickReplyCollege (name, block_id) {
    return {
      "action": "block",
      "label": `${name}`,
      "messageText": `${name}`,
      "blockId": `${block_id}`,
      "extra": {
        "college": `${name}`
      }
    };
  }

  for(let i = 0; i < collegeArray.length; i += 1) {
    outputJson.template.quickReplies[i] = addQuickReplyCollege(collegeArray[i], '5c69875de821274ba78931b6');
  }
  outputJson.template.quickReplies[collegeArray.length] = addQuickReplyCollege('이전', '5c697eab05aaa75509ea5cbe');

  return outputJson;

}

function sendEngiMajor() {
  let engiArray = ['도시계획학과','조경학과','실내건축학과','건축학과','건축공학과','전기공학과','설비소방학과','화공생명공학과'];
  let outputJson = {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `공과대학 내 해당되는 학과를 선택해주세요!`
          }
        },
      ],
      "quickReplies": [
      ],
    }
  };

  function addQuickReplyMajor (name, block_id) {
    return {
      "action": "block",
      "label": `${name}`,
      "messageText": `${name}`,
      "blockId": `${block_id}`,
      "extra": {
        "major": `${name}`
      }
    };
  }

  for(let i = 0; i < engiArray.length; i += 1) {
    outputJson.template.quickReplies[i] = addQuickReplyMajor(engiArray[i], '5c697eab05aaa75509ea5cbe');
  }
  outputJson.template.quickReplies[engiArray.length] = {
    "action": "block",
    "label": '학과 더보기',
    "messageText": '공과대학 학과 더보기',
    "blockId": '5c69875de821274ba78931b6',
    "extra": {
      "college": '공과대학2'
    }
  };
  outputJson.template.quickReplies[engiArray.length+1] = addQuickReplyMajor('이전', '5c6986d45f38dd01ebc06dd8');

  return outputJson;
}

function sendEngiMajorSecond() {
  let secondEngiArray = ['기계공학과','토목환경공학과','산업경영학과','신소재공학과'];
  let outputJson = {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `공과대학 내 해당되는 학과를 선택해주세요!`
          }
        },
      ],
      "quickReplies": [
      ],
    }
  };

  function addQuickReplyMajor (name, block_id) {
    return {
      "action": "block",
      "label": `${name}`,
      "messageText": `${name}`,
      "blockId": `${block_id}`,
      "extra": {
        "major": `${name}`
      }
    };
  }

  for(let i = 0; i < secondEngiArray.length; i += 1) {
    outputJson.template.quickReplies[i] = addQuickReplyMajor(secondEngiArray[i], '5c697eab05aaa75509ea5cbe');
  }
  outputJson.template.quickReplies[secondEngiArray.length] = {
    "action": "block",
    "label": '이전 학과',
    "messageText": '공과대학',
    "blockId": '5c69875de821274ba78931b6',
    "extra": {
      "college": '공과대학'
    }
  };

  return outputJson;
}


module.exports = {
  sendCarousel: sendCarousel,
  sendImageCarousel: sendImageCarousel,
  sendSimpleText: sendSimpleText,
  sendMajor: sendMajor,
  sendCollege: sendCollege,
  sendEngiMajor: sendEngiMajor,
  sendEngiMajorSecond: sendEngiMajorSecond,
}
