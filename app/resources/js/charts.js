const charts = (function() {

  const initCategoriesChart = function(data) {
    const context = $("#categoriesChart").get(0).getContext("2d");
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
    const context = $("#placesChart").get(0).getContext("2d");
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
