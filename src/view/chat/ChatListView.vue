<template>
  <div>
    <Logo />
    <HeaderComponent>
      <p>{{ title }}</p>
    </HeaderComponent>
    <row>
      <div class="chats_container">
        <div v-for="chatId in chatIds" :key="chatId" :chatId="chatId">
          <router-link :to="`/chats/${chatId}`" class="router-link">
            <div class="chat_preview">
              <div class="profile_img_div">
                <img
                  class="profile_img"
                  :src="getChatPreviewInfo(chatId).toNickNameThumbnailUrl"
                  alt="엑박"
                />
              </div>
              <div class="wrapper_info">
                <div class="chat_info">
                  <div class="chat_info_top">
                    <p class="username">
                      {{ getChatPreviewInfo(chatId).toNickName }}
                    </p>
                    <P class="chat_time">{{
                      getChatPreviewInfo(chatId).updateTime
                    }}</P>
                  </div>
                  <div class="chat_info_bottom">
                    {{ getChatPreviewInfo(chatId).lastMessage }}
                  </div>
                </div>
                <div class="item_img_div">
                  <img
                    class="item_img"
                    :src="getChatPreviewInfo(chatId).itemThumbnailUrl"
                    alt="엑박"
                  />
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <NavComponent />
    </row>
  </div>
</template>
<script>
import Logo from "@/components/user/LogoComponent.vue";
import NavComponent from "@/components/user/NavComponent.vue";
import HeaderComponent from "@/components/user/HeaderComponent.vue";

export default {
  name: "ChatListView",
  components: { Logo, NavComponent, HeaderComponent },
  data() {
    return {
      title: "대화 내역",
      chatIds: [],
      myId: "",
      chatPreviewInfos: [],
    };
  },

  computed: {
    getChatPreviewInfo() {
      return (chatId) => {
        const chatPreviewInfo = this.chatPreviewInfos[chatId - 1];
        return chatPreviewInfo ? chatPreviewInfo : "";
      };
    },
  },

  created() {
    // TODO: 로그인 할 시 자신의 id가 vuex의 user.id 에 저장하도록 구현하기
    this.myId = this.$store.state.user.id;
    // 내가 참여 중인 채팅방 아이디 찾기
    this.$store.dispatch("findChatIds", this.myId).then(() => {
      this.chatIds = this.$store.state.chatIds;

      // ChatIds를 가져오면서 채팅 리스트에 보여줄 정보 미리 가져오기
      if (this.chatIds.length !== 0) {
        this.$store
          .dispatch("findChatPreviewInfos", {
            chatIds: this.chatIds,
            userId: this.myId,
          })
          .then(() => {
            this.chatPreviewInfos = this.$store.state.chatPreviewInfos;
          });
      } else {
        // 테스트 용
        this.$store.state.chatIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        for (let i = 0; i < 10; i++) {
          this.$store.state.chatPreviewInfos.push({
            toNickName: "그랜드팜",
            toNickNameThumbnailUrl: "../../public/assets/img/profile1.png",
            lastMessage: "개맛도링",
            updateTime: "오전 09:30",
            itemThumbnailUrl: "../../public/assets/img/thumbnail1.png",
          });
        }
      }

      // jwt 토큰이 없으면 /home로 리디렉션
      // if (localStorage.getItem("jwt") == null) {
      //   router.replace("/home");
      // }
    });
  },
};
</script>

<style scoped>
@import "../../../public/assets/css/chats-page-style.css";
@import "../../../public/assets/css/chat-preview-style.css";
</style>
