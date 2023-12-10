import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/view/accounts/LoginView.vue";
import UserTemplate from "@/components/user/UserTemplate.vue";
import EasyLogin from "@/view/accounts/EasyLoginView.vue";
import FindIdView from "@/view/accounts/FindIDView.vue";
import FindPwView from "@/view/accounts/FindPWView.vue";
import RegisterView from "@/view/accounts/RegisterView.vue";
import PayView from "@/view/pay/PayView.vue";
import SuccessView from "@/view/pay/SuccessView.vue";
import ItemsView from "@/view/auction/ItemsView.vue";
import ProfileView from "@/view/user/ProfileView.vue";
import HomeView from "@/view/home/HomeView.vue";
import ItemDetailView from "@/view/auction/ItemDetailView.vue";
import AuctionRegisterView from "@/view/auction/AuctionRegisterView.vue";
import MyPageView from "@/view/mypage/MyPageView.vue";
import UserInfoView from "@/view/mypage/UserInfoView.vue";
import FailView from "@/view/pay/FailView.vue";
import ChatListView from "@/view/chat/ChatListView.vue";
import ChatDetailView from "@/view/chat/ChatDetailView.vue";
import ChargingView from "@/view/charging/ChargingView.vue";
import AuctionPurchaseHistoryView from "@/view/mypage/AuctionPurchaseHistoryView.vue";
import AuctionSaleHistoryView from "@/view/mypage/AuctionSaleHistoryView.vue";
import AuctionView from "@/view/auction/AuctionView.vue";
import Admin from "@/view/admin/AdminView.vue";
import Chart from "@/view/admin/ChartView.vue";


const routes = [

  {
    path: "/",
    redirect: "/login",
    component: UserTemplate,
    children: [
      {
        path:"/auctionTest",
        component: AuctionView,
      },
      {
        path: "/login",
        component: LoginView,
      },
      {
        path: "/easyLogin",
        component: EasyLogin,
      },
      {
        path: "/findId",
        component: FindIdView,
      },
      {
        path: "/findPw",
        component: FindPwView,
      },
      {
        path: "/register",
        component: RegisterView,
      },
      {
        path: "/items",
        name: "items",
        component: ItemsView,
      },
      {
        path: "/profile",
        name: "profile",
        component: ProfileView,
      },
      {
        path: "/home",
        name: "home",
        component: HomeView,
      },
      // TODO : 식별 번호 수정 사항
      {
        path: "/auction/detail/:id",
        name: "detail",
        component: ItemDetailView,
      },
      {
        path: "/auction/register",
        component: AuctionRegisterView,
      },
      {
        path: "/user",
        name: "user",
        component: MyPageView,
      },
      {
        path: "/user/info",
        component: UserInfoView,
      },
      {
        path: "/user/history/purchase",
        component: AuctionPurchaseHistoryView,
      },
      {
        path: "/user/history/sales",
        component: AuctionSaleHistoryView,
      },
      {
        path: "/chats",
        name: "chats",
        component: ChatListView,
      },
      {
        path: "/chats/:id",
        name: "chat",
        component: ChatDetailView,
        props: true,
      },
      {
        path: "/charging",
        name: "charging",
        component: ChargingView,
      },
    ],
  },
  {
    path: "/pay",
    name: "pay",
    component: PayView,
  },
  {
    path: "/success",
    name: "success",
    component: SuccessView,
  },
  {
    path: "/fail",
    name: "fail",
    component: FailView,
  },
  {
    path: "/admin",
    component: Admin
  },
  {
    path: "/chart",
    component: Chart
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
