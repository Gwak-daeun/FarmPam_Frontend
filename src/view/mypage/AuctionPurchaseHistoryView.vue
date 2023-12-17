<template>
  <div>
    <LOGO />
    <HeaderComponent>
      <p>구내 내역</p>
    </HeaderComponent>
    <ItemPost :items="items"/>
    <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
      <template #spinner>
        <LoadingSpinner />
      </template>
      <template #no-more>
        <LoadComplete></LoadComplete>
      </template>
    </infinite-loading>
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
  name: "AuctionPurchaseHistoryView",
  components: {LoadingSpinner, InfiniteLoading, ItemPost, NavBar, HeaderComponent, LOGO},
  data() {
    return {
      items: [],
      page: 0,
      sortType: 'buyer'
    }
  },
  created() {
    this.myId = localStorage.getItem("username");
    console.log("myId: " + this.myId)
  },
  inject: ["$http"],
  methods: {
    infiniteHandler($state) {
      this.$http.get("/item/list", {
        params: {
          page: this.page,
          sortType: this.sortType
        },
      }).then((res) => {
        if (res.data.length) {
          console.log("페이지: " + this.page);

          this.items.push(...res.data.filter(item => item.buyer === this.myId));

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
          console.log("데이터가 비어 있습니다.");
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

</style>
