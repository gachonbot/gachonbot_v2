function sendFoodRanking (food) {
  let outputJson = {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": "좋아요 상위 5개 맛집입니다!"
          }
        },
        {
          "carousel": {
            "type": "basicCard",
            "items": []
          }
        }
      ],
      "quickReplies": [
        {
          "action": "block",
          "label": `${food[0].name}`,
          "messageText": `${food[0].name}`,
          "blockId": `5c64110de8212717d2bfaabc`,
          "extra": {
            "food_id": `${food[0].id}`
          }
        },
        {
          "action": "block",
          "label": `${food[1].name}`,
          "messageText": `${food[1].name}`,
          "blockId": `5c64110de8212717d2bfaabc`,
          "extra": {
            "food_id": `${food[1].id}`
          }
        },
        {
          "action": "block",
          "label": `${food[2].name}`,
          "messageText": `${food[2].name}`,
          "blockId": `5c64110de8212717d2bfaabc`,
          "extra": {
            "food_id": `${food[2].id}`
          }
        },
        {
          "action": "block",
          "label": `${food[3].name}`,
          "messageText": `${food[3].name}`,
          "blockId": `5c64110de8212717d2bfaabc`,
          "extra": {
            "food_id": `${food[3].id}`
          }
        },
        {
          "action": "block",
          "label": `${food[4].name}`,
          "messageText": `${food[4].name}`,
          "blockId": `5c64110de8212717d2bfaabc`,
          "extra": {
            "food_id": `${food[4].id}`
          }
        },
        {
          "action": "block",
          "label": "이전",
          "messageText": `맛집`,
          "blockId": "5c6accb505aaa75509ea69c8",
        },
        {
          "action": "block",
          "label": "🏠",
          "messageText": `🏠`,
          "blockId": "5c6aceb7384c5541a0ee5bcc",
        },
      ],
    }
  };

  function addCarouselItem (name, detail, number, like, image){
    return {
      "title": `${name}`,
      "description": `👍 ${like}\n\n${detail}`,
      "thumbnail": {
        "imageUrl": `${image}`
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
        }
      ]
    };
  }

  for(let i = 0; i < food.length; i += 1) {
    let imageUrl = "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg";
    const imagesLeng = food[i].images.length;
    if (imagesLeng > 0) {
      const imagesRand = Math.floor(imagesLeng * Math.random());
      imageUrl = food[i].images[imagesRand].url;
    }
    outputJson.template.outputs[1].carousel.items[i] = addCarouselItem(food[i].name, food[i].detail, food[i].number, food[i].like, imageUrl);
  }

  return outputJson;

}

function sendFoodInit (cnt) {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `현재 ${cnt[0][0].count}개의 음식점이 등록되어있어요! 원하시는 음식종류를 선택해주세요!`
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
          {
            "action": "block",
            "label": "이전",
            "messageText": `맛집`,
            "blockId": "5c6accb505aaa75509ea69c8",
          },
      ]
    }
  };
}

function sendFoodDetail (food_id, food) {
  let imageUrl = "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg";
  const imagesLeng = food.images.length;
  if (imagesLeng > 0) {
    const imagesRand = Math.floor(imagesLeng * Math.random());
    imageUrl = food.images[imagesRand].url;
  }
  return {
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
                  "imageUrl": `${imageUrl}`
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
          "label": "사진보기",
          "messageText": `${food.name} 사진보기`,
          "blockId": "5c668bb1384c5541a0ee4fde",
          "extra": {
            "food_id": `${food_id}`
          }
        },
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
          "blockId": "5c66b0f65f38dd01ebc06a44",
        },
      ],
    }
  };
}

function sendFoodLikeY (food_id, food) {
  return {
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
          "blockId": "5c66b0f65f38dd01ebc06a44",
        },
      ],
    }
  };
}

function sendFoodLikeN (food_id) {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `한 음식점에 좋아요는 한 번만 누를 수 있어요...!`
          }
        },
      ],
      "quickReplies": [
        {
          "action": "block",
          "label": "이전",
          "messageText": `이전`,
          "blockId": "5c64110de8212717d2bfaabc",
          "extra": {
            "food_id": `${food_id}`
          }
        },
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

function sendFailLike () {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `좋아요는 다음과 같은 카드의 하단 버튼을 통해 이용하실 수 있어요!`
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
          "blockId": "5c66b0f65f38dd01ebc06a44",
        },
      ],
    }
  };
}

function sendNoImage (food_id) {
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `아직 등록된 이미지가 없어요...! 혹시 다녀오시면 '이미지 업로드' 부탁드릴게요! `
          }
        },
      ],
      "quickReplies": [
        {
          "action": "block",
          "label": "이미지 업로드",
          "messageText": `이미지 업로드`,
          "blockId": "5c68310e384c5541a0ee51e6",
          "extra": {
            "food_id": `${food_id}`
          }
        },
        {
          "action": "block",
          "label": "이전",
          "messageText": `이전`,
          "blockId": "5c64110de8212717d2bfaabc",
          "extra": {
            "food_id": `${food_id}`
          }
        },
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

function sendFoodCarousel(text, food) {
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

  function addCarouselItem (name, detail, number, image){
    return {
      "title": `${name}`,
      "description": `${detail}`,
      "thumbnail": {
        "imageUrl": `${image}`
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


  for(let i = 0; i < food.length; i += 1) {
    let imageUrl = "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg";
    const imagesLeng = food[i].images.length;
    if (imagesLeng > 0) {
      const imagesRand = Math.floor(imagesLeng * Math.random());
      imageUrl = food[i].images[imagesRand].url;
    }
    outputJson.template.outputs[1].carousel.items[i] = addCarouselItem(food[i].name, food[i].detail, food[i].number, imageUrl);
    outputJson.template.quickReplies[i] = addQuickReply(food[i].name, '5c64110de8212717d2bfaabc', food[i].id);
  }

  return outputJson;
}

function sendFoodImageCarousel(text, food_id, ...args) {
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

  function addImageCarouselItem (url, source){
    let sourceText = '출처: ' + source;
    if (source === null) {
      sourceText = '';
    }
    return {
      "description": `${sourceText}`,
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


  for(let i = 0; i < args[0].length; i += 1) {
    outputJson.template.outputs[1].carousel.items[i] = addImageCarouselItem(args[0][i].url, args[0][i].source);
  }
  outputJson.template.quickReplies[0] = addQuickReply('이미지 업로드', '5c68310e384c5541a0ee51e6', food_id);
  outputJson.template.quickReplies[1] = addQuickReply('이전', '5c64110de8212717d2bfaabc', food_id);
  outputJson.template.quickReplies[2] = addQuickReply('🏠', '5c66b0f65f38dd01ebc06a44', food_id);
  return outputJson;
}

function sendFoodRandom (food_id, food) {
  let foodType = food.type;
  let imageUrl = "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg";
  const imagesLeng = food.images.length;
  if (imagesLeng > 0) {
    const imagesRand = Math.floor(imagesLeng * Math.random());
    imageUrl = food.images[imagesRand].url;
  }
  if (foodType === '한식2') {
    foodType = '한식';
  }
  return {
    "version": "2.0",
    "template": {
      "outputs": [
        {
          "simpleText": {
            "text": `오늘은 ${foodType}어떠세요..? ${food.name} 맛있던데!`
          }
        },
        {
          "carousel": {
            "type": "basicCard",
            "items": [
              {
                "title": `${food.name}`,
                "description": `${food.detail}`,
                "thumbnail": {
                  "imageUrl": `${imageUrl}`
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
          "label": "사진보기",
          "messageText": `${food.name} 사진보기`,
          "blockId": "5c668bb1384c5541a0ee4fde",
          "extra": {
            "food_id": `${food_id}`
          }
        },
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
          "messageText": `${foodType} 맛집 리스트!`,
          "blockId": "5c6173795f38dd5839236bb4",
          "extra": {
            "food_type": `${food.type}`
          }
        },
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

module.exports = {
  sendFoodRanking: sendFoodRanking,
  sendFoodInit: sendFoodInit,
  sendFoodDetail: sendFoodDetail,
  sendFoodLikeY: sendFoodLikeY,
  sendFoodLikeN: sendFoodLikeN,
  sendFailLike: sendFailLike,
  sendNoImage: sendNoImage,
  sendFoodCarousel: sendFoodCarousel,
  sendFoodImageCarousel: sendFoodImageCarousel,
  sendFoodRandom: sendFoodRandom,
}
