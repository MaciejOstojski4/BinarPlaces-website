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
    });

    $("#gallery-tab").click(function() {
      apiClient.fetchPlaces()
        .then(function(response) {
          response.forEach(function(place) {
            if(place.id === 14) {
              apiClient.fetchPlaceImage(place.picture_url)
                .then(function (response) {
                  console.log(response);
                })
                .catch(function (error) {
                  console.log(error);
                })
            }
          })
        })
        .catch(function(error) {
          console.log(error);
        })
    });

    $("#map-tab").click(function() {
      initMap();
    })
  };

  const initMap =  function() {
    var lodz = {lat: 51.759249, lng: 19.455983};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: lodz
    });
    const places = userSession.getObject("places");
    places.forEach(function(place) {
      const marker = new google.maps.Marker({
        position: {lat: parseInt(place.location.lat), lng: parseInt(place.location.lon)},
        map: map,
        title: place.name
      });
      const infowindow = new google.maps.InfoWindow({
        content: prepareInfoWindowContent(place)
      });
      marker.addListener("click", function() {
        infowindow.open(map, marker);
      })
    });

    google.maps.event.addListener(map, "idle", function(){
      google.maps.event.trigger(map, 'resize');
    });
  };

  const prepareInfoWindowContent = function(place) {
    return "<div><div><h3>" + place.name + "</h3></div>" +
      "<div><p>" + place.location.address + "</p></div>" +
      "<div><p>Ocena:" + place.rate + "</p></div></div>";
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

    console.log(localStorage.getItem("email"));
    if(localStorage.getItem("email") !== null) {
      $("#rateFormPlaceId").attr("val", placeId);
      showAddRateBtnAttr();

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
    apiClient.addReview(review, userSession.obtainUser())
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const showAddRateBtnAttr = function(){
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
