<template>
  <div class="container">
    <row>
      <div class="advice" style="margin-left: 45px">회원가입</div>

      <div class="easyLoginForm">
        <label for="itemname"><span>* </span>이름</label>
        <input
          type="text"
          class="txt-input"
          id="itemname"
          style="width: 280px"
          v-model="state.form.realName"
        />
      </div>

      <div class="easyLoginForm">
        <label for="itempw"><span>* </span>아이디</label>
        <input
          type="text"
          class="txt-input"
          id="idInput"
          v-model="state.form.username"
        />
        <button style="width: 80px" class="mailButton" @click="checkId">
          중복체크
        </button>
      </div>

      <div class="easyLoginForm">
        <label for="itemnew"><span>* </span>비밀번호</label>
        <input
          type="password"
          class="txt-input"
          id="itemnew"
          style="width: 230px"
          v-model="state.form.password"
          @input="checkPasswordMatch"
        />
      </div>

      <div class="easyLoginForm">
        <label for="itemnew"><span>* </span>비밀번호 확인</label>
        <input
          type="password"
          class="txt-input"
          id="itemnew"
          style="width: 230px"
          v-model="userPWCheck"
          @input="checkPasswordMatch"
        />
      </div>
      <span v-if="!passwordsMatch" style="margin-left: 45px"
        >비밀번호가 일치하지 않습니다.</span
      >
      <div class="easyLoginForm">
        <label for="itemname"><span>* </span>이메일</label>
        <input
          type="email"
          class="txt-input"
          style="width: 280px"
          id="itemname"
          v-model="state.form.email"
        />
      </div>

      <div class="easyLoginForm">
        <label for="itempw"><span>* </span>전화번호</label>
        <input
          type="text"
          class="txt-input"
          style="width: 280px"
          id="itempw"
          v-model="state.form.phoneNumber"
        />

        <div class="col">
          <div v-show="phoneState !== '인증 진행중'">
            <!-- <div v-show="false"> -->
            <button
              style="width: 100px; margin-left: 95px !important"
              @click="sendPhoneNumber"
              class="phoneButton"
            >
              인증 번호 발송
            </button>
          </div>

          <div class="checkIng" v-show="phoneState == '인증 진행중'">
            <!-- <div class="checkIng" v-show="true"> -->
            <!-- <div class="phoneState">
            {{ phoneState }}
          </div> -->

            <input
              style="width: 100px"
              id="checkCodeInput"
              type="number"
              v-model="phoneCheckNum"
            />
            &nbsp; &nbsp;
            {{ minutes }}:{{ seconds < 10 ? "0" + seconds : seconds }}
            <button
              style="width: 80px"
              class="checkCodeInputBtn"
              @click="compareSMSNumber"
            >
              인증하기
            </button>
            <div class="phoneState"></div>
          </div>
        </div>
      </div>

      <div class="easyLoginForm">
        <label for="itemnew"><span>* </span>닉네임</label>
        <input
          type="text"
          class="txt-input"
          id="idInput"
          style="width: 280px"
          v-model="state.form.nickname"
        />
        <button
          style="margin-left: 85px !important"
          @click="checkNickname"
          class="mailButton"
        >
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
            v-model="state.form.mailCode"
          />

          <button
            style="width: 90px !important"
            class="mailButton"
            @click="search"
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
          style="width: 280px"
          v-model="state.form.streetAddress"
        />
      </div>
      <div class="easyLoginForm">
        <label for="itemnew"><span> </span>상세주소</label>
        <input
          type="text"
          class="txt-input"
          id="itemnew"
          style="width: 280px"
          v-model="state.form.detailAddress"
        />
      </div>

      <!-- <div 
     
      >
        <div style="margin-left: 40px">항목을 모두 작성해주세요</div>
      </div> -->
      <div>
        <button class="registerBtn" @click="submit">회원가입 하기</button>
      </div>
    </row>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import router from "@/router";
import instance from "@/api/http";
export default {
  name: "RegisterView",
  inject: ["$http"],
  data() {
    const passwordsMatch = ref(false);
    onMounted(() => {
      if (localStorage.getItem("username")) {
        router.replace("home");
      }
    });

    const state = reactive({
      form: {
        realName: "",
        username: "",
        userPassword: "",
        userPWCheck: "",
        email: "",
        phoneNumber: "",
        nickname: "",
        userLocal: "",
        mailCode: "",
        streetAddress: "",
        detailAddress: "",
      },
    });

    return {
      state,
      userPWCheck: "",
      passwordsMatch,
      phoneState: "인증 필요",
      minutes: 1,
      seconds: 0,
      phoneCheckNum: null,
      timer: null,
      usernameCheck: false,
      nicknameCheck: false,
      smsCodeCheck: true,
      countdown: null,
    };
  },
  methods: {
    submit() {
      // if (
      //   !this.state.form.username ||
      //   !this.state.form.realName ||
      //   !this.state.form.userPassword ||
      //   !this.state.form.email ||
      //   !this.state.form.phoneNumber ||
      //   !this.state.form.nickname ||
      //   !this.state.form.mailCode ||
      //   !this.state.form.streetAddress
      // ) {
      //   alert("필수 항목을 작성해주세요.");
      //   return;
      // }

      if (!this.usernameCheck) {
        alert("아이디 중복을 확인하세요.");
        return;
      }

      if (!this.nicknameCheck) {
        alert("닉네임 중복을 확인하세요.");
        return;
      }

      if (!this.smsCodeCheck) {
        alert("휴대폰 인증을 해주세요.");
        return;
      }
      // let data = {};
      // data.userName = this.userName;
      // data.userPassword = this.userPassword;
      // data.userEmail = this.userEmail;
      // data.userPhoneNumber = this.userPhoneNumber;
      // data.userLocal = this.userLocal;
      axios
        .post("http://localhost:8080/api/user/signup", this.state.form)
        .then(() => {
          alert("회원가입 완료");
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          window.alert("회원가입을 진행 할 수 없습니다.");
        });
    },

    checkPasswordMatch() {
      if (this.state.form.password !== this.userPWCheck) {
        this.passwordsMatch = false;
      } else {
        this.passwordsMatch = true;
      }
    },

    //인증번호 발송
    sendPhoneNumber() {
      clearInterval(this.timer);
      console.log("휴대폰 번호 인증 시작");
      instance
        .post("/checkPhoneNumber", this.state.form.phoneNumber)
        .then((res) => {
          alert("인증번호 발송 성공");
          this.phoneState = "인증 진행중";

          // 타이머 설정
          this.countdown = setInterval(() => {
            if (this.minutes === 0 && this.seconds === 0) {
              this.phoneState = "인증 필요";
              clearInterval(this.countdown); // 타이머 종료
            } else {
              if (this.seconds === 0) {
                this.minutes -= 1;
                this.seconds = 59;
              } else {
                this.seconds -= 1;
              }
            }
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //인증번호 확인
    compareSMSNumber() {
      console.log(
        "smsNumber : ",
        this.phoneCheckNum,
        ", phoneNumber : ",
        this.state.form.phoneNumber
      );
      instance
        .post("/compareSMSNumber", {
          smsNumber: this.phoneCheckNum,
          phoneNumber: this.state.form,
        })
        .then((res) => {
          this.smsCodeCheck = true;
          clearInterval(this.countdown); // 타이머 종료
          alert("휴대폰 인증에 성공하였습니다.");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    checkId() {
      instance
        .post("/checkUsername", this.state.form.username)
        .then((res) => {
          console.log(res.data);
          alert("사용 가능한 아이디 입니다.");
          this.usernameCheck = true;
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            alert(err.response.data);
          }
        });
    },

    checkNickname() {
      instance
        .post("/checkNickname", this.state.form.nickname)
        .then((res) => {
          console.log(res.data);
          alert("사용 가능한 닉네임 입니다.");
          this.nicknameCheck = true;
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            alert(err.response.data);
          }
        });
    },

    search() {
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

          this.state.form.mailCode = data.zonecode;
          this.state.form.streetAddress = roadAddr;
        },
      }).open();
    },
  },
};
</script>

<style scoped>
/* @import "../../../public/assets/css/register-page.css"; */
.container {
  width: 390px; /* 가로 크기 */
  height: 844px; /* 세로 크기 */
  border: #c0c0c0 1px solid;
  margin: 0 auto;
  display: flex;
  /* justify-content: left; */
  overflow: auto;
  /* background: antiquewhite; */
  flex-direction: column; /* 자식 요소들을 수직으로 배치하기 위해 column으로 설정합니다. */
  align-items: center; /* 세로 방향에서 중앙 정렬합니다. */
  flex-wrap: wrap;
    flex-direction: row;
    align-content: space-between;
}

#idInput {
  width: 170px;
  margin-right: 10px;
}

.colBox {
  display: flex;
  flex-direction: column;
}

#mail {
  width: 150px !important;
  margin-right: 30px;
}

.mailButton {
  width: 120px;
}

.advice {
  font-size: 30px;
  margin-top: 20px;
  width: 300px;
}

input {
  font-family: "Noto Sans KR", "Noto Sans Korean", "Nanum Gothic", sans-serif;
  border: 0;
  outline: none;
  font-size: 10px;
}
input::placeholder {
  color: #d9d9d9;
}
.easyLoginForm {
  box-sizing: border-box;
  margin: 10px auto;
  position: relative;
}
.easyLoginForm label {
  display: inline-block;
  position: absolute;
  top: -5px;
  left: 14px;
  padding: 5px;
  background: white;
  font-size: 14px;
  color: #888;
  font-weight: bold;
}
.easyLoginForm.ver2 label {
  top: initial;
  bottom: -20px;
}
.col {
  display: flex; /* 부모 요소를 Flex Container로 설정 */
  justify-content: left;
}
.easyLoginForm label span {
  color: #da4841;
  vertical-align: -1px;
}

.easyLoginForm {
  margin-left: 30px;
}
.easyLoginForm input {
  /* width: 80%; */
  margin-left: 10px;
  border: 1px solid #dddddd !important;
  font-size: 1rem;
  line-height: 1.45;
  letter-spacing: -0.04rem;
  border-radius: 5%;
  padding: 10px;
  margin-top: 12px;
}

button {
  background: #90ee90;
  border: transparent;
  width: 250px;
  height: 30px;
  font-size: 14px;
  border-radius: 5%;
  margin-left:0px;
  margin-top: 5px;
  margin-bottom: 10px;
}

button:hover {
  cursor: pointer;
}

.registerBtn {
  margin-left: 100px;
}
</style>
