<template>
  <div>
    <LOGO/>
    <div class="search">
      <div class="search-bar">
        <input v-model="keyword" @keyup.enter="btnClick" class="search-box" placeholder="검색할 물품을 입력하세요."/>
        <button class="search-btn" @click="btnClick"><img src="../../../public/assets/img/search-green.png" alt=""/>
        </button>
      </div>
    </div>
    <div class="select-box">
      <select class="select" v-model="sortType" @change="fetchData">
        <option value="latest">최신순</option>
        <option value="time">종료임박순</option>
      </select>
    </div>
    <div>
      <ItemPost :items="items"/>
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
import ItemPost from "@/components/item/ItemPostComponent.vue";
import NavBar from "@/components/user/NavComponent.vue";
import {InfiniteLoading} from "infinite-loading-vue3-ts";
import LoadingSpinner from "@/components/user/LoadingSpinner.vue";
import {requireRefreshToken} from "@/api/tokenApi.vue";
import SocketJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  name: "ItemView",
  components: {
    LoadingSpinner,
    InfiniteLoading,
    LOGO,
    ItemPost,
    NavBar
  },
  data() {
    return {
      bidIds: [],
      keyword: '',
      items: [],
      sortType: 'latest',
      page: 0,
      receiveList: [],
      currentPrice: [],
    }
  },

  created() {

    if (this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword;
    }
    if(this.$refs.InfiniteLoading){
      this.$refs.InfiniteLoading.stateChanger.reset();
    }
  },

  inject: ["$http"],
  methods: {

    fetchData() {
      if (this.sortType === 'latest') {
        this.sortType = 'latest';
      } else {
        this.sortType = 'time';
      }
      this.page = 0;
      this.items = [];
      this.$refs.infiniteLoading.stateChanger.reset();
    },

    infiniteHandler($state) {
      // this.webSocketConnection();
      this.$http.get("/item/list", {
        params: {
          page: this.page,
          sortType: this.sortType,
          keyword: this.keyword
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

    webSocketConnection(){
      this.receiveBidList();
      this.userName = localStorage.getItem("username");
      //소켓 연결
      const serverURL = "http://localhost:8080/bid";
      let socket = new SocketJS(serverURL);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
          {},
          (frame) => {
            this.connected = true;
            this.stompClient.subscribe("/bidList", (res) => {
              this.receiveList = JSON.parse(res.body);
              this.currentPrice = this.receiveList.at(-1);
            });
          },
          (error) => {
            this.connected = false;
          });

    },
    receiveBidList() {
      //입찰내역 호출
      this.bidId = this.$route.params.id;
      const msg = {
        bidId: this.bidId,
      };

      this.$http
          .post("/bid-list", JSON.stringify(msg), {})
          .then((res) => {
            this.receiveList = res.data;
            console.log("receiveData"+this.receiveList.at(0))
            this.currentPrice = this.receiveList.at(-1);
          })
          .catch((err) => {
            console.log(err);
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

    btnClick() {
      if (this.keyword.trim() !== '') {
        this.page = 0;
        this.items = [];
        this.$refs.infiniteLoading.stateChanger.reset();
        this.$router.push({path: "/items", query: {keyword: this.keyword}});
      } else {
        this.page = 0;
        this.items = [];
        this.$refs.infiniteLoading.stateChanger.reset();
      }
    },

  }

}
</script>

<style scoped>
@import "../../../public/assets/css/items-page.css";
</style>