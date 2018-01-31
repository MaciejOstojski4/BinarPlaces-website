const charts = (function() {

  const initCategoriesChart = function(labels) {
    const context = $("#categoriesChart").get(0).getContext("2d");
    const chart = new Chart(context, {
      type: "pie",
      data: {
        labels: ["Mexican", "Polish", "British"],
        datasets: [{
          label: "categories",
          data: [1, 5, 3]
        }]
      }
    })
  };

  return {
    initCategoriesChart: initCategoriesChart
  }
})();
