<template>
  <div ref="displayRef">
    <row>
      <div class="chat-box" ref="chatBox">
        <row>
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            ref="messageRef"
            :style="{ height: calculateMessageHeight(message.message) + 'px' }"
          >
            <p
              :class="{
                sender: isMyMessage(message.fromUserId),
                receiver: !isMyMessage(message.fromUserId),
              }"
              v-html="formatMessage(message.message)"
            ></p>
          </div>
        </row>
      </div>
      <div class="message-input-div" ref="inputDivRef">
        <textarea
          class="message-bar"
          placeholder="메시지 보내기"
          v-model="newMessage"
          @keydown.enter.prevent="handleEnterKey"
          rows="1"
          wrap="soft"
          ref="textareaRef"
          @input="adjustTextareaHeight"
          :style="{ height: 'auto' }"
        >
        </textarea>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          @click="sendMessage"
          class="send-button"
        >
          <mask
            id="mask0_530_2375"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="40"
            height="40"
          >
            <rect width="40" height="40" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_530_2375)">
            <path
              d="M4.375 29.1663V5.83301L32.0833 17.4997L4.375 29.1663ZM7.29167 24.7913L24.5729 17.4997L7.29167 10.208V15.3122L16.0417 17.4997L7.29167 19.6872V24.7913Z"
              fill="#D9D9D9"
            />
          </g>
        </svg>
      </div>
    </row>
  </div>
</template>
<script>
import Stomp from "webstomp-client";
import SockJS from "sockjs-client";

let stompClient = null;

export default {
  name: "ChatComponent",
  props: {
    chatId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      isSame: false,
      myNickname: "",
      isSocketConnected: false,
      messageHeight: 0,
    };
  },
  created() {
    this.isSocketConnected = false;
    this.myNickname = this.$store.state.user.nickname;
    this.myId = this.$store.state.user.id;

    this.getMessages();

    // jwt 토큰이 없으면
    // if(localStorage.getItem('accessToken') == null) {
    //   router.replace("/home");
    // }

    if (this.isSocketConnected == false) {
      this.connect();
    }
  },
  mounted() {
    this.scrollToBottom();
  },

  watch: {
    messages: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
    },
  },

  methods: {
    isMyMessage(fromUserId) {
      return this.myId === fromUserId;
    },
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        const currentTime = new Date();
        const formattedTime = this.formatTime(currentTime);

        const message = {
          fromUserId: this.myId,
          message: this.newMessage,
          updatedAt: formattedTime,
        };

        this.$store.dispatch("sendMessage", {
          message: message,
          chatId: this.chatId,
        });

        stompClient.send(
          `/receive/${this.chatId}`,
          JSON.stringify(message),
          {}
        );
        this.onMessageReceived();

        // this.messages.push({
        //   fromUserId: this.myId,
        //   message: this.newMessage,
        //   updatedAt: formattedTime,
        // });
        this.newMessage = "";
      }

      const textarea = this.$refs.textareaRef;
      textarea.style.height = "43px";

      const inputDiv = this.$refs.inputDivRef;
      inputDiv.style.height = "63px";

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    formatTime(time) {
      const year = time.getFullYear();
      const month = (time.getMonth() + 1).toString().padStart(2, "0");
      const day = time.getDate().toString().padStart(2, "0");
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      const seconds = time.getSeconds().toString().padStart(2, "0");

      const formattedTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

      return formattedTime;
    },

    scrollToBottom() {
      const chatBox = this.$refs.chatBox;
      chatBox.scrollTop = chatBox.scrollHeight;
    },

    adjustTextareaHeight() {
      const textarea = this.$refs.textareaRef;
      textarea.style.height = "43px";
      textarea.style.height = `${textarea.scrollHeight}px`;

      const inputDiv = this.$refs.inputDivRef;
      inputDiv.style.height = `${textarea.scrollHeight + 20}px`;

      this.messageHeight = `${textarea.scrollHeight}px`;
    },
    handleEnterKey(event) {
      if (event.shiftKey) {
        this.newMessage += "\n";
        this.adjustTextareaHeight();
      } else {
        this.sendMessage();
      }
    },
    formatMessage(message) {
      return message.replace(/\n/g, "<br>");
    },
    calculateMessageHeight(message) {
      if (this.messageHeight === 0) {
        // DB 채팅 내역 받아올 때 메시지 크기
        const brCount = (message.match(/\n/g) || [] || "<br>").length;
        const minHeight = 44;
        return minHeight + (brCount + 1) * 20;
      }
      return this.messageHeight;
    },
    connect() {
      this.isSocketConnected = true;

      let socket = new SockJS("http://localhost:8080");
      stompClient = Stomp.over(socket);
      stompClient.connect({}, this.onConnected, this.onError);
    },
    onConnected() {
      stompClient.subscribe(`/chat/${this.chatId}`, this.onMessageReceived);
    },
    onError() {
      console.log("소켓 연결 실패");
    },
    onMessageReceived(res) {
      setTimeout(() => {
        this.getMessages();
      });
    },
    getMessages() {
      // 채팅 내역 가져오기
      this.$store.dispatch("findChatMessages", this.chatId).then(() => {
        this.messages = this.messages = this.$store.state.chatMessages;
      });
    },
  },
};
</script>

<style scoped>
@import "../../../public/assets/css/chat-style.css";
</style>
