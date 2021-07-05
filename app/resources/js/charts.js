const charts = (function() {

  const initCategoriesChart = function(data) {
    const context = $("#categories-chart").get(0).getContext("2d");
    const chart = new Chart(context, {
      type: "pie",
      data: {
        labels: data.labels,
        datasets: [{
          label: "categories",
          data: data.numbers,
          backgroundColor: data.colors
        }]
      }
    })
  };

  const initPlacesChart = function(data) {
    const context = $("#places-chart").get(0).getContext("2d");
    const chart = new Chart(context, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [{
          label: "places",
          data: data.numbers,
          backgroundColor: data.colors
        }]
      }
    })
  };

  return {
    initCategoriesChart: initCategoriesChart,
    initPlacesChart: initPlacesChart
  }
})();
