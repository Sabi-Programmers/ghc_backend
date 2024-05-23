document.addEventListener("DOMContentLoaded", () => {
  new ApexCharts(document.querySelector("#pieChart"), {
    series: [94, 77, 62],
    chart: {
      height: 350,
      type: "pie",
      toolbar: {
        show: true,
      },
    },
    labels: ["Bronze", "Gold", "Diamond"],
  }).render();
});
