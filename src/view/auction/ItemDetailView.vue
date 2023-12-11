<template>
  <div>
    <LOGO/>
    <HeaderComponent>
      <p>경매</p>
    </HeaderComponent>
    <div class="detail-profile">
      <div class="detail-profile-box" @click="profile">
        <img :src="profileImg" alt="profileImg"/>
        <h3> {{ nickName }} </h3>
        <div class="review-avg">
          <div><img src="../../../public/assets/img/filled-star.png" alt="star"/>
          </div>
          <div><span> {{ review }} </span>
          </div>
        </div>
      </div>
      <div>
        <button class="detail-chat-btn">채팅하기</button>
      </div>
    </div>
    <div class="item-detail-img">
      <img :src="itemImg" alt="경매 상품 이미지">
    </div>
    <div class="item-content">
      <p class="content-title">{{ itemTitle }} {{ weight }}kg</p>
<!--      <button type="button" class="delete-btn" @click="deleteItem()">삭제</button>-->
      <div>
        <div class="tags-container"><span v-for="(tag, index) in tagNames" :key="index" class="tag-item">
            {{ tag }}
          </span>
        </div>
      </div>
      <p class="content-detail">{{ itemDetail }}</p>
    </div>
    <div class="item-footer">
      <div class="current-price">
        <span>현재 입찰가</span>
        <span> {{ currentPrice.content }}원 </span>
      </div>
      <div class="my-price">
        <span>내 입찰가</span>
        <span> {{ myPrice.toLocaleString() }}원 </span>
      </div>

      <!--      bid modal-->
      <div class="bid-bg" v-if="!bidModal">
        <div v-for="(item, index) in receiveList" :key="item.id">
<!--          <p class="bid-Message">경매 이름: {{ item.bidId}}</p>-->
          <p class="bid-Message"> {{index+1}} 번째 입찰 가격 {{item.content}}</p>
        </div>
        <div class="bid-btn">
          <div class="current-price-bid-box">
            <span>현재 입찰가</span>
            <span> {{currentPrice.content}}원 </span>
          </div>
          <div>
            <p class="bid-text">입찰할 금액(직접입력)</p>
          </div>
          <div>
<!--            <input v-model="userName" class="bid-input-box" type="text" placeholder="사용자 이름 입력.">-->
            <input v-model="bidPrice" class="bid-input-box" type="text" placeholder="입찰가 입력."><span
              class="bid-won">원</span>
          </div>
        </div>
        <div class="btn-a-bid" @click="sendBidPrice">
          <p class="bid-time"> {{ formatTime(remainingTime) }} </p>
          입찰하기
        </div>
      </div>

      <!--      아이템 디테일-->
      <div class="make-a-bid" v-if="bidModal" @click="bidModal=!bidModal">
        <p class="bid-time"> {{ formatTime(remainingTime) }} </p>
        <p>입찰하기</p>
      </div>
      <!--      <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Toggle bottom offcanvas</button>-->

      <!--      <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">-->
      <!--        <div class="offcanvas-header">-->
      <!--          <h5 class="offcanvas-title" id="offcanvasBottomLabel">Offcanvas bottom</h5>-->
      <!--          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>-->
      <!--        </div>-->
      <!--        <div class="offcanvas-body small">-->
      <!--          ...-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import LOGO from "@/components/user/LogoComponent.vue";
import Stomp from 'webstomp-client'
import SocketJS from 'sockjs-client'
import Auction from "@/components/auction/AuctionComponent.vue";
import index from "vuex";
import HeaderComponent from "@/components/user/HeaderComponent.vue";

export default {
  name: "ItemDetailView",
  computed: {
    index() {
      return index
    }
  },
  data() {
    return {
      profileImg: require("../../../public/assets/img/profile1.png"),
      nickName: "그랜드팜",
      review: 4.5,
      itemImg: require("../../../public/assets/img/apple.png"),
      currentPrice: [],
      myPrice: 9000,
      bidModal: true,

      bidId: "",
      publisher:"",
      userName:"",
      bidPrice:"",
      bidList:[],
      receiveList: [],
      // 불러온 아이템 정보
      items: [],
      weight: "",
      itemTitle: "",
      itemDetail: "",
      time: "",
      tagNames: [],
      timer: null,
      remainingTime: "",

    }
  },
  components: {
    HeaderComponent,
    LOGO,
  },
  inject: ["$http"],
  created() {
    this.connect()
  },
  methods: {
    connect(){
      this.receiveBidList();

      //소켓 연결
      const serverURL = "http://localhost:8080/bid"
      let socket = new SocketJS(serverURL);
      this.stompClient = Stomp.over(socket);
      console.log(`connected try. URL: ${serverURL}`)
      this.stompClient.connect(
          {},
          frame => {
            this.connected = true;
            console.log('connected success', frame);
            this.stompClient.subscribe("/bidList", res =>{
              console.log("response message", res.body);
              this.receiveList = JSON.parse(res.body);
              this.currentPrice = this.receiveList.at(-1);
              // this.currentPrice = this.receiveList.content.pop();
              // this.currentPrice.pop();
            });

          },
          error => {
            console.log('connected fail', error);
            this.connected = false;
          }
      );

      // 디테일 불러오기
      this.$http.get(`/item/detail/${this.$route.params.id}`)
          .then((res) => {
            this.itemTitle = res.data.itemTitle
            this.itemDetail = res.data.itemDetail
            this.weight = res.data.weight
            this.time = res.data.time
            this.tagNames = res.data.tagNames

            // 시간 출력 디자인
            this.remainingTime = res.data.time
            this.startTimer();

          }).catch((error) => {
        console.error(error);
      });

    },

    sendBidPrice(){
      console.log("Send bidPrice:" + this.bidPrice);
      if (this.stompClient && this.stompClient.connected) {
        const msg = {
          bidId: this.bidId,
          content: this.bidPrice,
        };
        this.stompClient.send("/bid-push", JSON.stringify(msg), {});
        console.log("receiveList : "+ this.receiveList);
      }
    },
    receiveBidList(){
      //입찰내역 호출
      this.bidId = this.$route.params.id;
      console.log(this.bidId);
      const msg = {
        bidId: this.bidId,
      };
      console.log("send bidId:"+ this.bidId);
      this.$http.post("/bid-list", JSON.stringify(msg), {
        headers: {

        }
      }).then(res =>{
        console.log("receiveList : "+res.data);
        this.receiveList = (res.data);
        console.log("!!!!!!!!!!receive last list" + this.receiveList.at(-1));
        this.currentPrice = this.receiveList.at(-1);
        // this.receiveList.push(this.currentPrice.pop());
        console.log("this currentPrice: "+this.currentPrice);


      }).catch(err => {
        console.log(err);
      });
    },

    onConnected(){


      // this.stompClient.send("/bid-list", JSON.stringify(this.userName), {})
      // this.stompClient.subscribe('/sub/chat/room' + this.roomId, this.onMessageReceived);
      // this.stompClient.send("/pub/chat/enterUser", {}, JSON.stringify({
      //   "roomId": this.roomId,
      //   userName: this.userName,
      //   type: 'ENTER'
      // }))
    },


    // 경매 삭제
    deleteItem() {
      this.$http.delete(`/item/delete/${this.$route.params.id}`)
          .then((res) => {
            if (res.status === 200) {
              console.log(res);
              window.alert("상품이 삭제되었습니다");
              this.$router.go(-1);
            }
          }).catch(() => {
        window.alert("상품 삭제에 실패했습니다");
      });
    },
    // 시간 디자인 변환
    startTimer() {
      this.timer = setInterval(() => {
        this.remainingTime -= 1000;
        if (this.remainingTime < 0) {
          clearInterval(this.timer);
          this.remainingTime = 0;
        }
      }, 1000);
    },
    formatTime(remainingTime) {
      if (remainingTime <= 0) {
        return '00:00:00';
      }
      const hours = Math.floor(remainingTime / 3600000);
      const minutes = Math.floor((remainingTime % 3600000) / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`;
    },
    padTime(time) {
      return (time < 10 ? '0' : '') + time;
    },

  }
}
</script>

<style scoped>
@import "../../../public/assets/css/item-detail-page.css";
@import "../../../public/assets/css/chat-style.css";
.bid-Message{
  text-align: center;
  color: #FFFFFF;
}
</style>
