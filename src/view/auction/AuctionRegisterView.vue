<template>
  <div class="wrapper">
    <LOGO />
    <HeaderComponent>
      <p>경매 등록</p>
    </HeaderComponent>
    <div class="img-upload">
      <!--     미리보기       -->
      <div class="img-preview">
        <div v-for="(file, index) in files" :key="index" class="img-file">
          <div class="img-close-button" @click="imageDeleteButton(index)">
            x
          </div>
          <img :src="file.preview" class="preview" alt="" />
        </div>
        <!--     사진 추가       -->
        <div v-if="!files.length">
          <label for="file" class="filelabel"
            ><img
              src="../../../public/assets/img/camera1.png"
              class="icon-camera"
              alt=""
          /></label>
          <input
            type="file"
            id="file"
            ref="files"
            multiple
            @change="imageAddUpload"
            style="display: none"
          />
        </div>
        <div v-else>
          <label for="file" class="filelabel"
            ><img src="../../../public/assets/img/add.png" class="icon" alt=""
          /></label>
          <input
            type="file"
            id="file"
            ref="files"
            multiple
            @change="imageAddUpload"
            style="display: none"
          />
        </div>
      </div>
    </div>
    <div class="main">
      <div>
        <input
          class="title-box"
          type="text"
          v-model="itemTitle"
          @input="onChange"
          placeholder=" 제목"
          required
        />
      </div>
      <div>
        <select class="type-box" v-model="city" required>
          <option value="" disabled selected>지역 선택</option>
          <option>서울</option>
          <option>부산</option>
          <option>대구</option>
          <option>인천</option>
          <option>광주</option>
          <option>대전</option>
          <option>울산</option>
          <option>세종</option>
          <option>경기도</option>
          <option>강원도</option>
          <option>충청북도</option>
          <option>충청남도</option>
          <option>전라북도</option>
          <option>전라남도</option>
          <option>경상북도</option>
          <option>경상남도</option>
          <option>제주</option>
        </select>
      </div>
      <div>
        <input
          class="price-box"
          type="text"
          v-model="minPrice"
          placeholder=" 최소 입찰 가격"
          required
        />
        원
      </div>
      <div class="timer">
        <select class="time-box" v-model="time" required>
          <option value="" disabled selected>시간 선택</option>
          <option value="3600">1시간</option>
          <option value="7200">2시간</option>
          <option value="10800">3시간</option>
          <option value="21600">6시간</option>
          <option value="43200">12시간</option>
          <option value="30">24시간</option>
        </select>
      </div>

      <div class="content-itemDetail">
        <textarea
          class="itemDetail-box"
          type="text"
          v-model="itemDetail"
          placeholder=" 상품 설명"
          required
        ></textarea>
      </div>
      <!--     태그 추가       -->
      <div class="tag-box">
        <div>
          <input
            type="text"
            v-model="tag"
            class="add-tag"
            @keyup.enter="addTag"
            placeholder=" 품목명 태그"
          />
          <button class="btn-add-tag" type="button" @click="addTag">
            태그 추가
          </button>
        </div>
        <div class="selected-tag-box-flex">
          <div
            class="selected-tag-box"
            v-for="(tag, i) in tags"
            :key="i"
            @click="removeTag(tag)"
            :tag="tag"
          >
            <div class="selected-tag">
              {{ tag }}
            </div>
            <div class="closeBtn">X</div>
          </div>
        </div>
      </div>
      <div>
        <input
          class="weight-box"
          type="text"
          v-model="weight"
          placeholder=" 무게"
        />
        kg
      </div>
    </div>
    <div class="btn-container">
      <button class="btn-start" type="submit" @click="submitPost">
        경매 시작!
      </button>
    </div>
  </div>
</template>

<script>
import LOGO from "@/components/user/LogoComponent.vue";
import HeaderComponent from "@/components/user/HeaderComponent.vue";
import {requireRefreshToken} from "@/api/tokenApi.vue";

export default {
  name: "AuctionRegisterView",
  components: {
    LOGO,
    HeaderComponent,
  },
  data() {
    return {
      userName: "",
      itemTitle: "",
      minPrice: "",
      time: 0,
      itemDetail: "",
      tag: "",
      city: "",
      weight: "",
      tags: [],

      files: [],
      filesPreview: [],
      uploadImageIndex: 0,
    };
  },
  inject: ["$http"],
  methods: {
    imageAddUpload() {
      let num = -1;
      if (this.files.length + this.$refs.files.files.length > 5) {
        return;
      }

      for (let i = 0; i < this.$refs.files.files.length; i++) {
        if (this.files.length + this.$refs.files.files.length > 5) {
          return;
        }

        for (let i = 0; i < this.$refs.files.files.length; i++) {
          const fileType = this.$refs.files.files[i].name.toLowerCase();
          if (
            !fileType.includes("jpg") &&
            !fileType.includes("png") &&
            !fileType.includes("gif") &&
            !fileType.includes("JPEG")
          ) {
            alert(`이미지 파일(JPG,JPEG,GIF,PNG)만 첨부해주세요.`);
            return;
          }

          this.files.push({
            file: this.$refs.files.files[i],
            preview: URL.createObjectURL(this.$refs.files.files[i]),
            number: i + this.uploadImageIndex,
          });

          this.uploadImageIndex = num + 1;
        }
        console.log(this.files);
      }
    },
    imageDeleteButton(index) {
      this.files = this.files.filter((data, i) => i !== index);
      console.log(this.files);
    },
    async submitPost() {
      const formData = new FormData();

      formData.append("itemTitle", this.itemTitle);
      formData.append("minPrice", this.minPrice);
      formData.append("itemDetail", this.itemDetail);
      formData.append("city", this.city);
      formData.append("weight", this.weight);
      formData.append("time", this.time);

      for (let i = 0; i < this.files.length; i++) {
        formData.append("files", this.files[i].file);
      }

      const tagArray = this.tags;
      const arrayAsString = tagArray.join(",");
      formData.append("tagNames", arrayAsString);

      formData.append("userId", localStorage.getItem("username"));

      const username = localStorage.getItem("username");
      const encodedUsername = btoa(unescape(encodeURIComponent(username)));
      await this.$http
        .post("/item/new", formData, {
          headers: {
            "Content-Type": "multipart/form-data;  charset=UTF-8",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            username: encodedUsername ,
          },
        })
        .then((res) => {
          location.href = "http://localhost:8081/items";
        })
        .catch((err) => {
          if(err.response.data == "please send refreshToken")
            console.log("리프레시 토큰 요청");
          requireRefreshToken();
          window.alert("상품 등록 실패");
        });
    },

    addTag() {
      if (this.tag == " " || this.tag == "") {
        return;
      }
      if (this.tags.length >= 5) {
        return;
      }
      if (this.tags.indexOf(this.tag) != -1) {
        return;
      }
      this.tags.push(this.tag);
      this.tag = "";
    },
    removeTag(tag) {
      let index = this.tags.indexOf(tag);
      if (index !== -1) {
        this.tags.splice(index, 1);
      }
    },
    onChange(event) {
      console.log(event.target.value);
    },
  },
};
</script>

<style scoped>
/* 상품 이미지 */

.filelabel {
  border: solid #98CB98 1px;
  border-radius: 10px;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
}

.icon-camera {
  width: 30px;
  height: 30px;
}

.img-upload {
  width: 100%;
  height: 110px;
  padding: 15px 15px 0 15px;
  display: flex;
  white-space:nowrap;
  overflow: auto;
}

.img-preview {
  display: flex;
  margin-right: 3px;

}

.preview {
  width: 80px;
  height: 80px;
  border-radius: 10px;
}

.img-file {
  position: relative;
  margin: 5px;
}

.img-close-button {
  position: absolute;
  z-index: 2;
  font-size: large;
  font-weight: bold;
  color: white;
  margin-left: 5px;
}

/* main */

.main {
  width: 100%;
  padding: 10px 20px 0 20px;
}
.timer {
  width: 350px;
}
.title-box {
  width: 350px;
  height: 35px;
  border: solid #98CB98 1px;
  border-radius: 5px;
  margin-bottom: 15px;
}
.time-box, .type-box {
  width: 350px;
  height: 35px;
  border: solid #98CB98 1px;
  border-radius: 5px;
  margin-bottom: 15px;
  color: #c7c6c6;
}
.itemDetail-box {
  width: 100%;
  height: 200px;
  border: solid #98CB98 1px;
  border-radius: 5px;
  margin-bottom: 15px;
}
.price-box, .weight-box {
  width: 90%;
  height: 35px;
  border: solid #98CB98 1px;
  border-radius: 5px;
  margin-bottom: 15px;
}

/* 태그 박스 */
.tag-box {
  display: flex;
  flex-direction: column;
}
.add-tag {
  width: 70%;
  height: 40px;
  border: solid #98CB98 1px;
  border-radius: 5px;
  margin-bottom: 15px;
}
.btn-add-tag {
  width: 90px;
  height: 40px;
  color: white;
  background-color: #98CB98;
  border: none;
  border-radius: 5px;
  margin: 0px 0px 0px 12px;
}
.selected-tag-box-flex {
  display: flex;
  width: 100%;
  white-space:nowrap;
  overflow: auto;
  margin-bottom: 10px;
}
.selected-tag-box {
  display: flex;
  align-items: center;
  height: 30px;
  font-size: small;
  margin-right: 10px;
}
.closeBtn {
  margin-left: 5px;
  color: #98CB98;
}

/* 경매 버튼 */

.btn-container {
  width: 390px;
  height: 50px;
  z-index: 3;
  top: 794px;
  position: fixed;
  display: flex;
  justify-content: center;
  background-color: #98CB98;
}
.btn-start {
  border: none;
  color: white;
  font-weight: bold;
  font-size: larger;
  background-color: #98CB98;
  margin: auto;
}

</style>
