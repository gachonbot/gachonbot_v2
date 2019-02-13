// const basicJson = {
//   "version": "2.0",
//   "template": {
//     "outputs": [
//       {
//         "simpleText": {
//           "text": `${text}`
//         }
//       },
//       {
//         "carousel": {
//           "type": "basicCard",
//           "items": [
//             {
//               "title": `${food[0].name}`,
//               "description": `${food[0].detail}`,
//               "thumbnail": {
//                 "imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
//               },
//               "buttons": [
//                 {
//                   "action": "phone",
//                   "label": "전화걸기",
//                   "phoneNumber": `${food[0].number}`
//                 },
//                 {
//                   "action":  "webLink",
//                   "label": "위치보기",
//                   "webLinkUrl": `https://map.naver.com/index.nhn?query=가천대 ${food[0].name}&tab=1`
//                 }
//               ]
//             },
//           ]
//         }
//       }
//     ]
//   }
// };


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
        }
      ]
    };
  }

  function addQuickReply (name) {
    return {
      "action": "block",
      "label": `${name}`,
      "messageText": `${name}`,
      "blockId": "5c6173795f38dd5839236bb4",
      "extra": {
        "food_name": `${name}`
      }
    };
  }

  for(let i = 0; i < args[0].length; i += 1) {
    outputJson.template.outputs[1].carousel.items[i] = addCarouselItem(args[0][i].name, args[0][i].detail, args[0][i].number);
    outputJson.template.quickReplies[i] = addQuickReply(args[0][i].name);
  }

  return outputJson;
}


module.exports = {
  sendCarousel: sendCarousel,
}
