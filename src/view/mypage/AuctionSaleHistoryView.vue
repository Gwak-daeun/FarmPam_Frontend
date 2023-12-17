<template>
  <div>
    <LOGO />
    <HeaderComponent>
      <p>판매 내역</p>
    </HeaderComponent>
    <div class="tab">
      <ul class="tabnav">
        <li><a @click="tab1Click" :class="{ active: tab1 }">판매 중</a></li>
        <li><a @click="tab2Click" :class="{ active: tab2 }">거래 완료</a></li>
      </ul>
      <div class="tabcontent">
        <div id="tab1" v-if="tab1"></div>
        <div id="tab2" v-if="tab2"></div>
      </div>
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
import HeaderComponent from "@/components/user/HeaderComponent.vue";
import NavBar from "@/components/user/NavComponent.vue";
import ItemPost from "@/components/item/ItemPostComponent.vue";
import {InfiniteLoading} from "infinite-loading-vue3-ts";
import LoadingSpinner from "@/components/user/LoadingSpinner.vue";
import {requireRefreshToken} from "@/api/tokenApi.vue";

export default {
  name: "AuctionSaleHistoryView",
  components: {
    LoadingSpinner,
    InfiniteLoading,
    ItemPost,
    NavBar,
    HeaderComponent,
    LOGO,
  },
  data() {
    return {
      tab1: true,
      tab2: false,

      items: [],
      page: 0,
      sortType: '',
    }
  },
  created() {
    this.myId = localStorage.getItem("username");
    console.log("myId: " + this.myId)
  },
  inject: ["$http"],
  methods: {

    tab1Click() {
      this.tab1 = true;
      if (this.tab1) {
        this.tab2 = false;
      }
      this.sortType = 'latest';
      this.loadData()
    },
    tab2Click() {
      this.tab2 = true;
      if (this.tab2) {
        this.tab1 = false;
      }

      this.sortType = 'completed';
      this.loadData()
    },

    loadData() {
      this.page = 0;
      this.items = [];
      this.$refs.infiniteLoading.stateChanger.reset();
    },

    infiniteHandler($state) {
      this.$http.get("/item/list", {
        params: {
          page: this.page,
          sortType: this.sortType
        },
      }).then((res) => {
        console.log("타입: " + this.sortType)
        if (res.data.length) {

          console.log("페이지: " + this.page);

          this.items.push(...res.data.filter(item => item.userId === this.myId));

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
  }
}
</script>

<style scoped>
@import "../../../public/assets/css/tab-component.css";
</style>