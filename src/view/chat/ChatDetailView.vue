<template>
  <div>
    <logo />
    <Header>
      <p>{{ chatDetailInfo.toNickName }}</p>
    </Header>
    <div class="chat-header">
      <div class="item-img-div">
        <img class="item-img" :src="chatDetailInfo.itemThumbnailUrl" alt="" />
      </div>
      <div class="item-info">
        <p class="item-title">{{ chatDetailInfo.itemTitle }}</p>
        <p class="item-price">{{ formattedBiddingPrice }}원</p>
      </div>
    </div>
    <Chat :chatId="chatId" />
  </div>
</template>
<script>
import Logo from "@/components/user/LogoComponent.vue";
import Chat from "@/components/chat/ChatComponent.vue";
import Header from "@/components/user/HeaderComponent.vue";

export default {
  name: "ChatDetailView",
  components: { Logo, Chat, Header },
  data() {
    return {
      chatDetailInfo: {
        toNickName: "테스트 닉네임",
        itemTitle: "테스트 타이틀",
        itemThumbnailUrl: "테스트 경매 사진",
        biddingPrice: 40000,
      },
    };
  },
  computed: {
    chatId() {
      return this.$route.params.id;
    },
    formattedBiddingPrice() {
      return this.chatDetailInfo.biddingPrice.toLocaleString();
    },
  },
  created() {
    this.myId = this.$store.state.user.id;
    this.$store
      .dispatch("findChatDetailInfo", {
        chatId: this.chatId,
        userId: this.myId,
      })
      .then(() => {
        this.chatDetailInfo = this.$store.state.chatDetailInfo;
      });
  },
};
</script>

<style scoped>
@import "../../../public/assets/css/chat-page-style.css";
</style>
