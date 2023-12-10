export const data = {
    labels: ['4 / 8', '4 / 9', '4 / 10', '4 / 11', '4 / 12', '4 / 13', '4 / 14', '4 / 15', '4 / 16', '4 / 17'],
    datasets: [
      {
        borderWidth: 1, // 라인 넓이
        label: '총 수면 시간', // 데이터 라벨
        backgroundColor: 'rgb(255,255,255, 0)',
        pointBackgroundColor: '#64CCA2',
        fill: true, // 채우기
        //  barPercentage: 1, // 바 안쪽 넓이
        //  categoryPercentage: 0.5,// 바 외부 넓이
        tension: 0.1,
        borderColor: '#64CCA2',
        pointBorderColor: '#64CCA2',
        pointBorderWidth: 1,
        data: [45, 50, 60, 50, 45, 80, 50, 40, 68, 70],
      },
    ],
  }
  
  export const options = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // 범례 표시
        labels: {
                // boxWidth: 8,
                // padding: 10,
                usePointStyle: true,
                pointStyle: "dash",
                borderColor: "#8D43CFFF",
                font: {
                  size: 14,
                  backgroundColor:  "#8D43CF"
                }
              },
      }
    },
    elements: {
      point: {
      radius: 0, // 점 크기 설정 (0으로 지정하여 점을 제거)
      hitRadius: 0,
      hoverRadius: 0,
      borderWidth: 0,
      hoverBorderWidth: 0
    }
    }




    // plugins: {
    //   legend: {
    //     display: true,
    //     position: "left",
    //     labels: {
    //       // boxWidth: 8,
    //       // padding: 10,
    //       usePointStyle: true,
    //       pointStyle: "star",
    //       font: {
    //         size: 14
    //       }
    //     },
    //     // fullSize: true,
    //     align: "center"
    //   },
    // }
    
  }
  