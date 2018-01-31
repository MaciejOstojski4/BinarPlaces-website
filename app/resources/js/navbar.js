const navbar = (function () {

  const CATEGORIES_IN_NAVBAR = 5;

  const addCategoriesToNavbar = function ($navbar) {
    addDefaultCategory($navbar);
    addMostPopularCategory($navbar);
    addCategoryInDropdown($navbar);
  };

  const addDefaultCategory = function ($navbar) {
    const allPlacesCategory = '<li><a href=MAIN_CONTENT_ANCHOR><span>-1</span>Wszystkie</a></li>';
    $navbar.append(allPlacesCategory);
  };

  const addMostPopularCategory = function ($navbar) {
    for (var i = 0; i < CATEGORIES_IN_NAVBAR; i++) {
      const category = placesContainer.getCategories()[i];
      const liElem = '<li><a href=MAIN_CONTENT_ANCHOR><span>' + category.id + '</span>' + category.name + '</a></li>';
      $navbar.append(liElem);
    }
  };

  const addCssToNavbarElem = function ($navbar) {
    $navbar.children().addClass("navbar-list-element");
    $navbar.find("a").addClass("navbar-list-element-link");
    $navbar.find("span").addClass("hidden");
  };

  const displayPlaces = function (data, categoryID) {
    var $placesContainer = placesContainer.removeCardsWithPlaces();
    const places = data.sort(placesContainer.sortPlacesByRate);
    placesContainer.prepareCardsWithPlaces($placesContainer, places, categoryID);
    $("#loader").hide();
    $("#content").show();
  };

  const addOnClickToNavbarElem = function ($navbar) {
    $navbar.find("li:not(last)").click(function (e) {
      e.preventDefault();
      $("#loader").show();
      const categoryID = parseInt($(this).find("span").text());
      apiClient.fetchPlaces(categoryID)
        .then(function (data) {
          displayPlaces(data, categoryID)
        })
        .catch(function (error) {
          console.log(error)
        });
      window.location = "#main-content";
    })
  };

  const addCategoryInDropdown = function ($navbar) {
    const $selectLi = $('<li class="dropdown show"><a href="#" data-toggle="dropdown">Inne</a></li>');
    $navbar.append($selectLi);
    const $dropDownList = $("<div>").addClass("dropdown-menu navbar-dropdown-category").appendTo($selectLi);
    for (var j = CATEGORIES_IN_NAVBAR; j < placesContainer.getCategories().length; j++) {
      const category = placesContainer.getCategories()[j];
      const categoryOp = '<a href="MAIN_CONTENT_ANCHOR"><span>' + category.id + '</span>' + category.name + '</a>';
      $dropDownList.append(categoryOp);
    }
  };

  const sortCategoriesByCount = function (first, second) {
    if (first.count > second.count) {
      return -1;
    } else if (first.count < second.count) {
      return 1;
    } else {
      return 0;
    }
  };

  const addNavbarElem = function ($container) {
    const $navbar = $("<nav>").addClass("row navbar").appendTo($container);
    return $("<ul>").addClass("navbar-list").appendTo($navbar);
  };

  const prepareNavbar = function (data) {
    const categories = data.sort(sortCategoriesByCount);
    placesContainer.setCategories(categories);
    const $header = $("#navbar");
    const $navbar = addNavbarElem($header);
    addCategoriesToNavbar($navbar);
    addCssToNavbarElem($navbar);
    addOnClickToNavbarElem($navbar);
  };

  return {
    prepareNavbar: prepareNavbar
  }
})();
