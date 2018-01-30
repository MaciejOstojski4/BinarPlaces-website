const placesContainer = (function () {

  const CARDS_IN_ROW = 3;

  var categories = [];

  var choosenCategoryId = -1;

  const setCategories = function (data) {
    categories = data;
  };

  const getCategories = function () {
    return categories;
  };

  const preparePlaceObject = function(imgBase64) {
    const place = {
      name: $("input[name=placeName]").val(),
      address: $("input[name=placeAddress]").val(),
      lat: parseInt($("input[name=placeLat]").val()),
      lon: parseInt($("input[name=placeLon]").val()),
      category_id: parseInt($("#placeCategoriesSelect option:selected").val()),
      picture: imgBase64
    };
    return  $.param(place);
  };

  const setOnClickListeners = function() {
    $("#add-new-place").click(function() {
      const $selectCategories = $("#placeCategoriesSelect");
      categories.forEach(function(category) {
        const $categoryOption = $("<option>").html(category.name).attr("value", category.id);
        $categoryOption.appendTo($selectCategories);
      })
    });

    $("#newPlaceForm").submit(function(e) {
      e.preventDefault();
      const fileReader = new FileReader();
      fileReader.addEventListener("load", function () {
        const place = preparePlaceObject(fileReader.result);
        apiClient.uploadNewPlace(place)
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      }, false);
      fileReader.readAsDataURL($("input[name=placeImage]").get(0).files[0])
    })
  };

  const removeCardsWithPlaces = function () {
    var $placeContainer = $("#place-card-container");
    $placeContainer.children().remove();
    return $placeContainer;
  };

  const sortPlacesByRate = function (first, second) {
    if (first.rate > second.rate) {
      return -1;
    } else if (first.rate < second.rate) {
      return 1;
    } else {
      return 0;
    }
  };

  const prepareCardsWithPlaces = function ($placeContainer, allPlaces, categoryID) {
    choosenCategoryId = categoryID;
    var places = getPlacesByCategory(allPlaces, categoryID);
    var $row;
    places.forEach(function (place, index) {
      if ((index % CARDS_IN_ROW) === 0) {
        $row = createRowForCard($placeContainer);
      }
      const $column = createColumnForCard($row);
      const $placeCard = createPlaceCard($column);
      addPlaceInfoToCard($placeCard, place);
    });
  };

  const addPlaceInfoToCard = function ($card, place) {
    const placeImgSrc = resolveCardImgSrc(place.category_id);
    const category = getCategoryById(place.category_id);
    $("<img>", {src: placeImgSrc, width: "100px", height: "100px"})
      .addClass("img-circle").appendTo($card);
    $("<h2>").text(place.name).appendTo($card);
    $("<small>").text(category.name).appendTo($card);
    $("<h4>").text(place.location.address).appendTo($card);
    addRateHolder($card, place);
  };

  const addRateHolder = function ($card, place) {
    const $rateHolder = $('<div data-toggle="modal" data-target="#ratesModal">').appendTo($card);
    $rateHolder.attr("id", "rateHolder" + place.id);
    const $rates = $('<select>').appendTo($rateHolder);
    for (var i = 0; i < 5; i++) {
      $('<option value=' + (i + 1) + '>').text(i + 1).appendTo($rates);
    }
    $rates.barrating({
      theme: 'fontawesome-stars-o',
      initialRating: place.rate,
      readonly: true
    });
    $rateHolder.click(showPlaceReviewsModal);
  };

  const showReviews = function(reviews) {
    const $container = $("#reviews-container");
    $container.empty();
    reviews.forEach(function (rev) {
      const $revBox = $("<div>").addClass("review-box").appendTo($container);
      const $revRate = $("<div>").addClass("review-rate").appendTo($revBox);
      const $revContent = $("<div>").addClass("review-content").appendTo($revBox);
      const $revAuthor = $("<div>").addClass("review-author").appendTo($revBox);
      const $revDate = $("<div>").addClass("review-date").appendTo($revBox);

      $revRate.text(rev.rate);
      $revContent.text(rev.content);
      $revAuthor.text(rev.username);
      $revDate.text(rev.created_at);
    })
  };

  const showPlaceReviewsModal = function (event) {
    const placeId = event.currentTarget.id.slice(10);
    apiClient.fetchPlaceReviews(placeId)
      .then(function (data) {
        console.log(data);
        showReviews(data);
      })
      .catch(function (error) {
        console.log(error)
      });

    if(!localStorage.user) {
      $("#rateFormPlaceId").attr("val", placeId);
      const $modalFooter = ("#ratesModalFooter");
      setAddRateBtnAttr();
      $addRateBtn.appendTo($modalFooter);

      const $createReviewForm = $("#createRateForm");
      $createReviewForm.submit(sendReview);
    }
  };

  const sendReview = function(e) {
    e.preventDefault();
    const rateContent = $("#rateContent").val();
    const mark = $("input[name=rateMark]:checked").val();
    const review = {
      content: rateContent,
      rate: mark,
      placeId: $("#rateFormPlaceId").attr("val")
    };
    apiClient.addReview(review);
  };

  const setAddRateBtnAttr = function(){
    $("#create-review-modal").css("display", "block").removeClass("hidden");
  };

  const resolveCardImgSrc = function (categoryID) {
    switch (categoryID) {
      case 1:
        return "resources/images/pizza-food.jpeg";
      case 2:
        return "resources/images/chinese-food.jpeg";
      case 3:
        return "resources/images/indian-food.jpeg";
      case 4:
        return "resources/images/cafe-food.jpeg";
      default:
        return "resources/images/default-food.jpeg";
    }
  };

  const createRowForCard = function ($container) {
    return $("<div/>").addClass("row").appendTo($container);
  };

  const createColumnForCard = function ($row) {
    return $("<div>").addClass("col-md-4").appendTo($row);
  };

  const createPlaceCard = function ($column) {
    return $("<div>").addClass("place-card text-center").appendTo($column);
  };

  const getPlacesByCategory = function (places, categoryID) {
    if (categoryID === -1) {
      return places;
    }
    return places.filter(function (place) {
      if (place.category_id === categoryID) {
        return place;
      }
    });
  };

  const getCategoryById = function (categoryID) {
    const category = categories.filter(function (c) {
      if (c.id === categoryID) {
        return c;
      }
    });
    return category[0];
  };

  const init = function() {
    setOnClickListeners();
  };

  return {
    removeCardsWithPlaces: removeCardsWithPlaces,
    sortPlacesByRate: sortPlacesByRate,
    prepareCardsWithPlaces: prepareCardsWithPlaces,
    setCategories: setCategories,
    getCategories: getCategories,
    init: init,
  }
})();

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
    const $header = $("#header");
    const $navbar = addNavbarElem($header);
    addCategoriesToNavbar($navbar);
    addCssToNavbarElem($navbar);
    addOnClickToNavbarElem($navbar);
  };

  return {
    prepareNavbar: prepareNavbar
  }
})();

const app = (function () {

  const setDateInFooter = function () {
    const date = new Date();
    $("#copyrightInfo").text("Copyright " + date.getFullYear());
  };

  const hideElementOnStart = function () {
    $("#content").hide();
    $("#loader").hide();
  };

  const init = function () {
    placesContainer.init();

    const loginForm = $("#loginForm");
    loginForm.submit(login);

    const registerForm = $("#registerForm");
    registerForm.submit(register);

    setDateInFooter();
    hideElementOnStart();
    apiClient.fetchCategories()
      .then(function (data) {
        navbar.prepareNavbar(data)
      })
      .catch(function (error) {
        console.log(error)
      });
  };

  const login = function (e) {
    e.preventDefault();
    const data = $("#loginForm").serialize();
    apiClient.login(data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const register = function (e) {
    e.preventDefault();
    const data = $("#registerForm").serialize();
    apiClient.register(data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return {
    init: init,
  }
})();

$(function () {
  app.init();
});
