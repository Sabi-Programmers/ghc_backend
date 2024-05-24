document.addEventListener("DOMContentLoaded", () => {
  const pieChart = document.getElementById("pieChart");

  const bronze = Number(pieChart.getAttribute("data-bronze"));
  const gold = Number(pieChart.getAttribute("data-gold"));
  const diamond = Number(pieChart.getAttribute("data-diamond"));

  if (pieChart) {
    new ApexCharts(document.querySelector("#pieChart"), {
      series: [bronze, gold, diamond],
      chart: {
        height: 350,
        type: "pie",
        toolbar: {
          show: true,
        },
      },
      labels: ["Bronze", "Gold", "Diamond"],
    }).render();
  }
});
