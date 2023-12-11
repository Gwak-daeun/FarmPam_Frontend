import { createStore } from "vuex";
import {
  getChatIds,
  getChatPreviewInfos,
  getChatDetailInfo,
  getChatMessages,
  sendMessage,
} from "@/api/http";

const store = createStore({
  state() {
    return {
      amount: 0,
      user: {
        // TODO: 유저정보를 DB에서 조회해서 값 주입시키기
        id: "mrHong",
        name: "홍길동",
        nickname: "홍홍홍",
        email: "test@test.com",
        mobilePhone: "01012345678",
        farmMoney: 150000,
      },
      chatIds: [0],
      chatPreviewInfos: [
        {
          toNickName: "테스트 닉네임",
          toNickNameThumbnailUrl: "테스트 프로필 사진",
          lastMessage: "테스트 메시지",
          updateTime: "2023/01/01",
          itemThumbnailUrl: "테스트 경매 사진",
        },
      ],
      chatDetailInfo: {
        toNickName: "테스트 닉네임",
        itemTitle: "테스트 타이틀",
        itemThumbnailUrl: "테스트 경매 사진",
        biddingPrice: 40000,
      },

      chatMessages: [
        {
          fromUserId: 0,
          message: "",
          updateAt: "",
        },
      ],
    };
  },
  mutations: {
    charging(state, data) {
      state.amount = data;
    },
    setUserInfo(state, id, name, nickname, email, mobilePhone, farmMoney) {
      state.user.id = id;
      state.user.name = name;
      state.user.nickname = nickname;
      state.user.email = email;
      state.user.mobilePhone = mobilePhone;
      state.user.farmMoney = farmMoney;
    },
    addFarmMoney(state) {
      // TODO: 팜머니 업데이트 체크
      state.user.farmMoney += state.amount;
    },
    setChatIds(state, chatIds) {
      state.chatIds = chatIds;
    },
    setChatPreviewInfos(state, chatPreviewInfos) {
      state.chatPreviewInfos = chatPreviewInfos;
    },
    setChatDetailInfo(state, chatDetailInfo) {
      state.chatDetailInfo = chatDetailInfo;
    },
    setChatMessages(state, chatMessages) {
      state.chatMessages = chatMessages;
    },
  },
  actions: {
    // 내가 참여중인 채팅방 아이디 찾기
    findChatIds({ commit }, userId) {
      return getChatIds(userId)
        .then((response) => {
          commit("setChatIds", response.data);
        })
        .catch(function () {
          console.log("findChatIds Error");
        });
    },

    // 채팅방 프리뷰 정보 가져오기
    findChatPreviewInfos({ commit }, { chatIds, userId }) {
      return getChatPreviewInfos(chatIds, userId)
        .then((response) => {
          commit("setChatPreviewInfos", response.data);
          console.log(store.state.chatPreviewInfos);
        })
        .catch(function () {
          console.log("findChatPreviewInfos Error");
        });
    },

    findChatDetailInfo({ commit }, { chatId, userId }) {
      return getChatDetailInfo(chatId, userId)
        .then((response) => {
          commit("setChatDetailInfo", response.data);
        })
        .catch(function () {
          console.log("findChatDetailInfo Error");
        });
    },

    findChatMessages({ commit }, chatId) {
      return getChatMessages(chatId)
        .then((response) => {
          commit("setChatMessages", response.data);
        })
        .catch(function () {
          console.log("findChatMessages Error");
        });
    },

    sendMessage({ commit }, { message, chatId }) {
      return sendMessage(message, chatId)
        .then(() => {
          store.dispatch("findChatMessages", chatId);
        })
        .catch(function () {
          console.log("sendMessage Error");
        });
    },
  },
  getters: {
    getAmount(state) {
      return state.amount;
    },
    getUserId(state) {
      return state.user.id;
    },
    getUserName(state) {
      return state.user.name;
    },
    getUserNickName(state) {
      return state.user.nickname;
    },
    getUserEmail(state) {
      return state.user.email;
    },
    getUserMobilePhone(state) {
      return state.user.mobilePhone;
    },
    getUserFarmMoney(state) {
      return state.user.farmMoney;
    },
    getChatIds(state) {
      return state.chatIds;
    },
    getChatPreviewInfos(state) {
      return state.chatPreviewInfos;
    },
  },
});

export default store;
