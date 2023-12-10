<template>
  <div>
    <!-- 헤더 -->
    <div class="adminHeader">
      <img class="adminLogo" src="../../../public/assets/img/adminLogo.png" />
      <div class="adminName">나무니 님</div>
      <button class="adminLogoutBtn">로그아웃</button>
    </div>

    <!-- 경매 현황 -->
    <div class="adminContainer">
      <div class="auctionReport">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">판매자</th>
              <th scope="col">품목</th>
              <th scope="col">무게</th>
              <th scope="col">거래일</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">핀</th>
              <td>당근</td>
              <td>5kg</td>
              <td>2023-08-30</td>
            </tr>
            <tr>
              <th scope="row">제이크</th>
              <td>당근</td>
              <td>5kg</td>
              <td>2023-08-30</td>
            </tr>
            <tr>
              <th scope="row">비모</th>
              <td>당근</td>
              <td>5kg</td>
              <td>2023-08-30</td>
            </tr>
            <tr>
              <th scope="row">마셀린</th>
              <td>당근</td>
              <td>5kg</td>
              <td>2023-08-30</td>
            </tr>
          </tbody>
        </table>
        <div class="paginations1">
          <a href="#" class="page-link">&laquo;</a>
          <a href="#" class="page-link">1</a>
          <a href="#" class="page-link">2</a>
          <a href="#" class="page-link">3</a>
          <a href="#" class="page-link">&raquo;</a>
        </div>
      </div>

      <!-- 경매중 -->
      <div class="auctionIng"></div>
    </div>

    <div class="adminContainer">
      <!-- 시세 -->
      <div class="chart-container">
        <input class="adminSearch" />
        <div
          class="chart"
          v-for="(chartData, index) in chartDatas"
          :key="index"
        >
          <ChartView :chartData="chartData" />
          <!-- {{ chartData }} -->
        </div>

        <div class="paginations2">
          <a href="#" class="page-link">&laquo;</a>
          <a href="#" class="page-link">1</a>
          <a href="#" class="page-link">2</a>
          <a href="#" class="page-link">3</a>
          <a href="#" class="page-link">&raquo;</a>
        </div>
      </div>

      <!-- 회원 현황 -->
      <div class="memberReport"></div>
    </div>
  </div>
</template>

<script>
import ChartView from "./ChartView.vue";

export default {
  name: "App",
  components: { ChartView },
  data() {
    return {
      chartDatas: [
        {
          labels: [
            "4 / 8",
            "4 / 9",
            "4 / 10",
            "4 / 11",
            "4 / 12",
            "4 / 13",
            "4 / 14",
            "4 / 15",
            "4 / 16",
            "4 / 17",
          ],
          datasets: [
            {
              borderWidth: 1,
              label: "배", //변수
              backgroundColor: "rgb(255,255,255, 0)",
              pointBackgroundColor: "#64CCA2",
              fill: true, // 채우기
              tension: 0.1,
              borderColor: "#64CCA2",
              pointBorderColor: "#64CCA2",
              pointBorderWidth: 1,
              data: [
                1000, 500, 6000, 50000, 405, 80000, 11150, 1240, 1268, 1270,
              ], //변수
            },
          ],
        },
        {
          labels: [
            "4 / 8",
            "4 / 9",
            "4 / 10",
            "4 / 11",
            "4 / 12",
            "4 / 13",
            "4 / 14",
            "4 / 15",
            "4 / 16",
            "4 / 17",
          ],
          datasets: [
            {
              borderWidth: 1,
              label: "사과", //변수
              backgroundColor: "rgb(255,255,255, 0)",
              pointBackgroundColor: "#64CCA2",
              fill: true, // 채우기
              tension: 0.1,
              borderColor: "#64CCA2",
              pointBorderColor: "#64CCA2",
              pointBorderWidth: 1,
              data: [
                1000, 500, 6000, 50000, 405, 80000, 11150, 1240, 1268, 1270,
              ], //변수
            },
          ],
        },
        {
          labels: [
            "4 / 8",
            "4 / 9",
            "4 / 10",
            "4 / 11",
            "4 / 12",
            "4 / 13",
            "4 / 14",
            "4 / 15",
            "4 / 16",
            "4 / 17",
          ],
          datasets: [
            {
              borderWidth: 1,
              label: "포도", //변수
              backgroundColor: "rgb(255,255,255, 0)",
              pointBackgroundColor: "#64CCA2",
              fill: true, // 채우기
              tension: 0.1,
              borderColor: "#64CCA2",
              pointBorderColor: "#64CCA2",
              pointBorderWidth: 1,
              data: [
                1000, 500, 6000, 50000, 405, 80000, 11150, 1240, 1268, 1270,
              ], //변수
            },
          ],
        },
        {
          labels: [
            "4 / 8",
            "4 / 9",
            "4 / 10",
            "4 / 11",
            "4 / 12",
            "4 / 13",
            "4 / 14",
            "4 / 15",
            "4 / 16",
            "4 / 17",
          ],
          datasets: [
            {
              borderWidth: 1,
              label: "포도", //변수
              backgroundColor: "rgb(255,255,255, 0)",
              pointBackgroundColor: "#64CCA2",
              fill: true, // 채우기
              tension: 0.1,
              borderColor: "#64CCA2",
              pointBorderColor: "#64CCA2",
              pointBorderWidth: 1,
              data: [
                1000, 500, 6000, 50000, 405, 80000, 11150, 1240, 1268, 1270,
              ], //변수
            },
          ],
        },
      ],
    };
  },
};
</script>


<style scoped>
body {
  /* display: flex;
  align-items: center; */
}

.adminContainer {
  display: flex;
  align-items: center;
  margin-left: 60px;
}

.adminHeader {
  display: flex;
  min-width: 950px;
  width: 100%;
  height: 65px;
  background-color: #404040;
}
.adminLogo {
  width: 160px;
  margin-left: 20px;
}
.adminLogoutBtn {
  margin-top: 15px;
  border-radius: 5px;
  width: 110px;
  margin-right: 20px;
}
.adminName {
  margin-top: 20px;
  width: 100px;
  margin-left: 64%;
  color: aliceblue;
}
.auctionReport {
  width: 650px;
  height: 500px;
  border: #404040 solid 1px;
  margin: 100px 30px;
}
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  text-align: center;
  padding: 8px;
}

/* 페이지네이션 스타일 */
.paginations1 {
  display: flex;
  justify-content: center;
  margin-top: 240px;
}
.paginations2 {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  margin-left: 330px;
}

.page-link {
  display: inline-block;
  padding: 8px 12px;
  text-decoration: none;
  color: #333;
  border: 1px solid #ccc;
  margin: 0 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.page-link:hover {
  background-color: #f2f2f2;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  /* gap: 5px; */
  width: 650px;
  height: 530px;
  border: #404040 solid 1px;
  margin: 10px 30px;
}
.chart {
  margin-top: 40px;
  margin-left: 8px;
}

.adminSearch {
  position: absolute;
  border: #333 solid 1px;
  width: 180px;
  margin-left: 250px;
  margin-top: 22px;
}
.auctionIng {
  width: 650px;
  height: 500px;
  border: #333 solid 1px;
}
.memberReport{
    width: 650px;
  height: 500px;
  border: #333 solid 1px;
}
</style>