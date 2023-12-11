import axios from "axios";

const instance = axios.create({
  timeout: 10000,
  baseURL: "/api",
  headers: {
    "content-type": "application/json",
  },
});

// 채팅 아이디 가져오기
function getChatIds(userId) {
  return instance.get(`/chats/chatIds`, {
    params: {
      userId: userId,
    },
    headers: {
      "Content-Type": "text/plain",
      "X-AUTH-TOKEN": localStorage.getItem("accessToken"),
    },
  });
}

// 채팅리스트 Preview 데이터 가져오기
function getChatPreviewInfos(chatIds, userId) {
  return instance.post(
    `/chats/chatPreviewInfos`,
    {
      chatIds,
      userId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": localStorage.getItem("accessToken"),
      },
    }
  );
}

function getChatDetailInfo(chatId, userId) {
  return instance.get(`/chats/chatDetailInfo`, {
    params: {
      chatId: chatId,
      userId: userId,
    },
    headers: {
      "Content-Type": "text/plain",
      "X-AUTH-TOKEN": localStorage.getItem("accessToken"),
    },
  });
}

function getChatMessages(chatId) {
  return instance.get(`/chats/chatMessages`, {
    params: {
      chatId: chatId,
    },
    headers: {
      "Content-Type": "text/plain",
      "X-AUTH-TOKEN": localStorage.getItem("accessToken"),
    },
  });
}

function sendMessage(message, chatId) {
  return instance.post(
    `/chats/chatMessage`,
    { message, chatId },
    {
      headers: {
        "X-AUTH-TOKEN": localStorage.getItem("accessToken"),
      },
    }
  );
}

export {
  instance,
  getChatIds,
  getChatPreviewInfos,
  getChatDetailInfo,
  getChatMessages,
  sendMessage,
};
