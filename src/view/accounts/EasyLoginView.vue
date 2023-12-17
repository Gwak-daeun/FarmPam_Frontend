<template>
  <div class="container">
    <row>
      <div class="advice">
        <p>간편 로그인 완료를 위해</p>
        <p>추가 정보를 입력해주세요</p>
      </div>
      <div class="easyLoginForm">
        <label for="itemname"><span>* </span>이름</label>
        <input
          type="text"
          class="txt-input"
          id="itemname"
          v-model="state.form.username"
        />
      </div>

      <div class="easyLoginForm">
        <label for="itempw"><span>* </span>전화번호</label>
        <input
          type="text"
          class="txt-input"
          id="itempw"
          v-model="state.form.phoneNumber"
        />
        <div class="col">
          <div v-show="phoneState !== '인증 진행중'">
            <button
              style="width: 170px; margin-left: 75px !important"
              @click="sendPhoneNumber"
              class="phoneButton"
            >
              휴대폰 인증 번호 발송
            </button>
          </div>

          <!-- 인증번호 -->
          <div
            class="phoneState"
            style="position: absolute; margin-left: 270px; margin-top: 35px"
            v-show="phoneState == '인증 진행중'"
          >
            {{ minutes }}:{{ seconds < 10 ? "0" + seconds : seconds }}
          </div>

          <div class="checkIng" v-show="phoneState == '인증 진행중'">
            <!-- <div class="checkIng" v-show="true"> -->
            <div class="phoneState">
              <!-- {{ phoneState }} -->
            </div>

            <input
              style="width: 100px; height: 20px; margin-left: 40px"
              id="checkCodeInput"
              type="number"
              v-model="phoneCheckNum"
            />

            <button
              style="width: 70px"
              class="checkCodeInputBtn"
              @click="compareSMSNumber"
            >
              인증하기
            </button>
          </div>
        </div>
      </div>

      <div class="easyLoginForm">
        <label for="itemnew"><span>* </span>닉네임</label>
        <input
          type="text"
          class="txt-input"
          id="itempw"
          style="width: 200px"
          v-model="state.form.nickname"
        />
        <button style="width: 110px" @click="checkNickname" class="mailButton">
          닉네임 중복체크
        </button>
      </div>

      <div class="colBox">
        <div class="easyLoginForm">
          <label for="itemnew"><span>* </span>우편번호</label>
          <input
            type="text"
            class="txt-input"
            id="mail"
            style="height: 50px"
            v-model="state.form.mailCode"
          />

          <button
            class="mailButton"
            @click="search"
            style="width: 110px; margin-left: 115px !important"
          >
            우편번호 찾기
          </button>
        </div>
      </div>

      <div class="easyLoginForm">
        <label for="itemnew"><span>* </span>도로명주소</label>
        <input
          type="text"
          class="txt-input"
          id="itemnew"
          v-model="state.form.streetAddress"
        />
      </div>
      <div class="easyLoginForm">
        <label for="itemnew"><span>* </span>상세주소</label>
        <input
          type="text"
          class="txt-input"
          id="itemnew"
          v-model="state.form.detailAddress"
        />
      </div>

      <button
        style="
          width: 200px;
          width: 120px;
          height: 40px;
          font-size: 20px;
          margin-left: 110px !important;
          margin-bottom: 50px;
        "
        class="registerBtn"
        @click="register"
      >
        회원가입 하기
      </button>
    </row>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { getCookie } from "@/api/tokenApi.vue";
import instance from "@/api/http";
import router from "@/router";

export default {
  inject: ["$http"],
  setup() {
    const state = reactive({
      form: {
        username: "",
        phoneNumber: "",
        nickname: "",
        mailCode: "",
        streetAddress: "",
        detailAddress: "",
      },
    });

    onMounted(() => {
      const accessToken = getCookie("accessToken");
      const refreshToken = getCookie("refreshToken");
      const username = getCookie("username");
      const roles = getCookie("roles");

      if (accessToken !== undefined && accessToken.length !== 0) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken !== undefined && refreshToken.length !== 0) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (username !== undefined && username.length !== 0) {
        localStorage.setItem("username", username);
      }
      if (roles !== undefined && roles.length !== 0) {
        localStorage.setItem("roles", roles);
      }

      // 읽어온 쿠키 값들을 활용하여 원하는 작업 수행
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      console.log("Username:", username);
      console.log("roles:", roles);

      function expireCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }

      expireCookie("accessToken");
      expireCookie("refreshToken");
      expireCookie("username");
      expireCookie("roles");

      if (localStorage.getItem("roles") == "ROLE_USER") {
        router.replace("home");
      }
    });

    const checkNickname = () => {
      if (state.form.nickname.length == 0) {
        alert("닉네임을 입력해주세요");
        return;
      }

      instance
        .post("/checkNickname", state.form.nickname)
        .then((res) => {
          console.log(res.data);
          alert("사용 가능한 닉네임 입니다.");
          state.form.nicknameCheck = true;
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            alert(err.response.data);
          }
        });
    };

    const phoneState = ref("인증 필요");
    let timer = ref(null);
    let minutes = ref(1);
    let seconds = ref(0);
    const phoneCheckNum = ref(null);

    const register = () => {
      const isEmptyField = Object.values(state.form).some(
        (value) => value === ""
      );

      if (!isEmptyField) {

        const username = localStorage.getItem("username");
        const encodedUsername = btoa(unescape(encodeURIComponent(username)));

        instance
          .post("/additionalInfo", state.form, {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              username: encodedUsername,
            },
          })
          .then((res) => {
            console.log(res.data);
            localStorage.setItem("roles", "ROLE_USER");
            location.href = "http://localhost:8081/home";
            // router.replace("home");
          })
          .catch((err) => {
            console.log(err);
            if (err.data) {
              alert(err.data);
            }
          });
      } else {
        alert("항목을 모두 작성해주세요.");
      }
    };

    //인증 번호 확인
    const compareSMSNumber = () => {
      console.log(
        "smsNumber : ",
        phoneCheckNum.value,
        ", phoneNumber : ",
        state.form.phoneNumber
      );
      instance
        .post("/compareSMSNumber", {
          smsNumber: phoneCheckNum.value,
          phoneNumber: state.form.phoneNumber,
        })
        .then((res) => {
          alert("휴대폰 인증에 성공하였습니다.");
          phoneState.value = "";
        })
        .catch((err) => {
          console.log(err);
        });
    };

    //인증 번호 발송
    const sendPhoneNumber = () => {
      clearInterval(timer.value);
      console.log("휴대폰 번호 인증 시작");
      instance
        .post("/checkPhoneNumber", state.form.phoneNumber)
        .then((res) => {
          alert("인증번호 발송 성공");
          phoneState.value = "인증 진행중";

          // 타이머 설정
          let countdown = setInterval(() => {
            if (minutes.value === 0 && seconds.value === 0) {
              console.log("인증 필요");
              phoneState.value = "인증 필요";
              clearInterval(countdown); // 타이머 종료
            } else {
              if (seconds.value === 0) {
                minutes.value -= 1;
                seconds.value = 59;
              } else {
                seconds.value -= 1;
              }
            }
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const search = () => {
      new window.daum.Postcode({
        oncomplete: (data) => {
          var roadAddr = data.roadAddress;
          var extraRoadAddr = "";

          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }

          if (data.buildingName !== "" && data.apartment === "Y") {
            extraRoadAddr +=
              extraRoadAddr !== ""
                ? ", " + data.buildingName
                : data.buildingName;
          }

          if (extraRoadAddr !== "") {
            extraRoadAddr = " (" + extraRoadAddr + ")";
          }

          if (roadAddr !== "") {
            roadAddr += extraRoadAddr;
          }

          state.form.mailCode = data.zonecode;
          state.form.streetAddress = roadAddr;
        },
      }).open();
    };

    return {
      state,
      search,
      register,
      phoneState,
      sendPhoneNumber,
      timer,
      minutes,
      seconds,
      phoneCheckNum,
      compareSMSNumber,
      checkNickname,
    };
  },
};
</script>

<style scoped>
/* @import "../../../public/assets/css/easy-login.css"; */
.container {
  width: 390px; /* 가로 크기 */
  height: 844px; /* 세로 크기 */
  border: #c0c0c0 1px solid;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  overflow: auto;
  /* background: antiquewhite; */
}
input {
  height: 60px;
}
.easyLoginForm label {
  height: 2px;
}

button {
  background: #90ee90;
  border: transparent;
  width: 250px;
  height: 35px;
  font-size: 15px;
  border-radius: 5px;
  margin-left: 25px;
  margin-top: 30px;
}

button:hover {
  cursor: pointer;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
