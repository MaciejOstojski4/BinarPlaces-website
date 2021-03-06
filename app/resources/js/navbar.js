const navbar = (function () {

  const CATEGORIES_IN_NAVBAR = 5;

  const addCategoriesToNavbar = function ($navbar) {
    addDefaultCategory($navbar);
    addMostPopularCategory($navbar);
    addCategoryInDropdown($navbar);
  };

  const addDefaultCategory = function ($navbar) {
    const allPlacesCategory =
      '<li><a href=MAIN_CONTENT_ANCHOR><span>-1</span>Wszystkie</a></li>';
    $navbar.append(allPlacesCategory);
  };

  const addMostPopularCategory = function ($navbar) {
    const categories = userSession.getObject("categories");
    for (var i = 0; i < CATEGORIES_IN_NAVBAR; i++) {
      const liElem = '<li><a href=MAIN_CONTENT_ANCHOR><span>'
        + categories[i].id + '</span>' + categories[i].name + '</a></li>';
      $navbar.append(liElem);
    }
  };

  const addCssToNavbarElem = function ($navbar) {
    $navbar.children().addClass("navbar-list-element");
    $navbar.find("a").addClass("navbar-list-element-link");
    $navbar.find("span").addClass("hidden");
  };

  const createColor = function() {
    return {
      red: parseInt(Math.random() * (255 - 50) + 50),
      green: parseInt(Math.random() * (200 - 10) + 10),
      blue: parseInt(Math.random() * 100)
    }
  };

  const prepareDataForCategoriesChart = function() {
    const categories = userSession.getObject("categories");
    const labels = categories.map(function(category) {
      return category.name
    });
    const numbers =  categories.map(function(category) {
      return category.places_count;
    });
    const colors = categories.map(function(category) {
      const color = createColor();
      return "rgba(" + color.red + "," + color.green + "," + color.blue + ", 0.5)";
    });
    return {
      labels: labels,
      numbers: numbers,
      colors: colors
    }
  };

  const prepareDataForPlacesChart = function() {
    const places = userSession.getObject("places");
    const labels = ["brak", "1", "2", "3", "4", "5"];
    var numbers = [0, 0, 0, 0, 0];
    places.forEach(function(place) {
      const rate = parseInt(place.rate);
      if(Number.isNaN(rate)) {
        numbers[0] += 1;
      } else {
        numbers[rate] += 1;
      }
    });
    const colors = places.map(function(places) {
      const color = createColor();
      return "rgba(" + color.red + "," + color.green + "," + color.blue + ", 0.5)";
    });
    return {
      labels: labels,
      numbers: numbers,
      colors: colors
    }
  };

  const displayPlaces = function () {
    // placesContainer.removeCardsWithPlaces("#place-card-container");
    // placesContainer.removeCardsWithPlaces("#gallery-card-container");
    placesContainer.prepareCardsWithPlaces($("#place-card-container"));
    placesContainer.prepareCardsWithImages($("#gallery-card-container"));
    const categoriesChartData = prepareDataForCategoriesChart();
    charts.initCategoriesChart(categoriesChartData);
    const placesChartData = prepareDataForPlacesChart();
    charts.initPlacesChart(placesChartData);
    $("#loader-section").hide();
  };

  const renderChoosenPlaces = (elem) => {
    $("#main-content").show();
    $("#loader-section").show();
    const categoryID = parseInt($(elem).find("span").text());
    userSession.saveObject(categoryID, "choosenCategory");
    displayPlaces();
    window.location = "#main-content";
  }

  const addOnClickToNavbarElem = function ($navbar) {
    $navbar.find("li:not(:last)").click(function (e) {
      e.preventDefault();
      renderChoosenPlaces(this);
    })

    $navbar.find("li").last().find("div a").click(function (e) {
      e.preventDefault();
      renderChoosenPlaces(this);
    })
  };

  const addCategoryInDropdown = function ($navbar) {
    const $selectLi = $('<li class="dropdown show"><a href="#" data-toggle="dropdown">Inne</a></li>');
    const $dropDownList = $("<div>").addClass("dropdown-menu navbar-dropdown-category").appendTo($selectLi);
    const categories = userSession.getObject("categories");
    for (var i = CATEGORIES_IN_NAVBAR; i < categories.length; i++) {
      const categoryOp = '<a href="MAIN_CONTENT_ANCHOR"><span>'
        + categories[i].id + '</span>' + categories[i].name + '</a>';
      $dropDownList.append(categoryOp);
    }
    $navbar.append($selectLi);
  };

  const init = function () {
    const $navbar = $("#navbar");
    const $ulNav = $("<ul>");
    addCategoriesToNavbar($ulNav);
    addCssToNavbarElem($ulNav);
    addOnClickToNavbarElem($ulNav);
    $ulNav.appendTo($navbar);
  };

  return {
    init: init,
    displayPlaces: displayPlaces
  }
})();
