<template>
  <div class="post">
    <div class="post-img-box" v-for="(item, i) in items" :key="i">
      <router-link :to='"/auction/detail/" + item.id'>
        <div class="post-img">
          <img :src="item.itemImgDtoList[0].imgUrl" class="thumbnail-img" alt="thumbnail-img"/>
          <div class="remaining-time" v-if="item.remainingTime > 0">
            <div class="time-bg">
              <p> {{ formatTime(item.remainingTime) }} 남음 </p>
            </div>
          </div>
          <div class="remaining-time" v-else>
            <div class="time-bg">
              <p> 경매 종료 </p>
            </div>
          </div>
        </div>
        <div class="post-content">
          <h3> {{ item.itemTitle }}</h3>
          <h3>{{ item.weight }}kg</h3>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import SocketJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  name: 'ItemPost',
  components: {},
  props: {
    items: Array,
  },

  data() {
    return {
      currentInfo: [],
      currentPrice: "",
    }
  },
  created() {
    this.connect();
  },

  inject: ["$http"],
  methods: {
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

    connect() {
      this.receiveBidPrice();
      const serverURL = "http://localhost:8080/bid";
      let socket = new SocketJS(serverURL);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
          {},
          (frame) => {
            this.connected = true;
            this.stompClient.subscribe("/bidPost", (res) => {
              this.currentInfo = JSON.parse(res.body);
              this.currentPrice = this.currentInfo;
              console.log(this.currentPrice);
            });
          },
          (error) => {
            this.connected = false;
          }
      );
    },
    receiveBidPrice() {
      this.$http.get("/bid-Post").then((res) => {
        this.currentInfo = res.data;
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.post {
  padding-bottom: 30px;
}
.post-img-box {
  margin-top: 10px;
  width: 100%;
  height: 140px;
  border-top: 1px solid #D9D9D9;
  border-bottom: 1px solid #D9D9D9;
}

.post-img {
  float: left;
  width: 140px;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.thumbnail-img {
  margin: auto;
  width: 110px;
  height: 110px;
  border-radius: 5px;
}

.remaining-time {
  position: absolute;
  bottom: 14px;
}

.time-bg {
  width: 110px;
  height: 30px;
  background-color: rgba(0, 0, 0, 60%);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.remaining-time p {
  text-align: center;
  font-size: 17px;
  line-height: 30px;
  color: #FFFFFF;
}

.post-content {
  float: left;
  margin-top: 15px;
  width: 220px;
  height: 110px;
  position: relative;
  color: black;
}

.post-content h5 {
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
}

.post-content .price {
  margin-top: 24px;
  float: right;
  color: #E12905;
}

</style>