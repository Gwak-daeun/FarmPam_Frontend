<template>
  <div>
    <LOGO />
    <SearchBar :style="{position: 'static'}"/>
    <div class="header-title">
      <h1>실시간 경매</h1>
    </div>
    <div>
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
              <p class="current-bid-price">현재 입찰가</p>
              <h3 class="price" v-if="currentInfo !== undefined && currentInfo[i] && currentInfo[i].bidPrice !== undefined"> {{ currentInfo[i].bidPrice }}원 </h3>
            </div>
          </router-link>
        </div>
      </div>
      <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
        <template #spinner>
          <LoadingSpinner />
        </template>
        <template #no-more>
          <LoadComplete></LoadComplete>
        </template>
      </infinite-loading>
    </div>
    <NavBar/>
  </div>
</template>

<script>
import LOGO from "@/components/user/LogoComponent.vue";
import SearchBar from "@/components/user/SearchBarComponent.vue";
import NavBar from "@/components/user/NavComponent.vue";
import ItemPost from "@/components/item/ItemPostComponent.vue";
import LoadingSpinner from "@/components/user/LoadingSpinner.vue";
import {InfiniteLoading} from "infinite-loading-vue3-ts";
import SocketJS from "sockjs-client";
import Stomp from "webstomp-client";
import {requireRefreshToken} from "@/api/tokenApi.vue";

export default {
  name: "HomeView",
  data() {
    return {
      bidIds: [],
      keyword: '',
      items: [],
      sortType: 'home',
      page: 0,
      currentInfo: [],
      currentPrice: "",
      receiveList: [],

    }
  },
  components: {
    InfiniteLoading, LoadingSpinner,
    LOGO,
    SearchBar,
    NavBar
  },
  created() {
    this.connect();
    if(this.$refs.InfiniteLoading){
      this.$refs.InfiniteLoading.stateChanger.reset();
    }
  },

  inject: ["$http"],
  methods: {
    infiniteHandler($state) {
      this.$http.get("/item/list", {
        params: {
          page: this.page,
          sortType: this.sortType,
        },
      }).then((res) => {
        if (res.data.length) {
          console.log("페이지: " + this.page)

          this.items.push(...res.data);
          this.items.forEach(item => {
            item.remainingTime = item.time;
            this.startStopwatch(item);
          });

          this.page ++
          $state.loaded();
          if (res.data.length  < 1) {
            $state.complete();
          }
        } else {
          $state.complete();
        }
      }).catch((err) => {
        if(err.response.data == "please send refreshToken") {
          console.log("리프레시 토큰 요청");
          requireRefreshToken();
        }
      });
    },

    startStopwatch(item) {
      if(item.timer) {
        clearInterval(item.timer);
      }
      item.timer = setInterval(() => {
        if (item.remainingTime > 0) {
          item.remainingTime -= 1000;
        } else {
          clearInterval(item.timer);
          item.remainingTime = 0;
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
    },

  }
}
</script>

<style scoped>
@import "../../../public/assets/css/home-page.css";
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

.post-content .current-bid-price {
  position: absolute;
  top: 90px;
  font-size: 18px;
  color: #0037ff;
}

.post-content .price {
  margin-top: 10px;
  float: right;
  color: #E12905;
}

</style>