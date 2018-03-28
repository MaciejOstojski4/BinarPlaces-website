const placesContainer = (function () {

  const ROOT_URL = "http://taste-api.binarlab.com";

  const CARDS_IN_ROW = 3;

  const preparePlaceObject = function(imgBase64) {
    const place = {
      name: $("input[name=placeName]").val(),
      address: $("input[name=placeAddress]").val(),
      lat: parseInt($("input[name=placeLat]").val()),
      lon: parseInt($("input[name=placeLon]").val()),
      category_id: parseInt($("#place-categories-select option:selected").val()),
      picture: imgBase64
    };
    return $.param(place);
  };

  const initPlaceForm = function() {
    const $selectCategories = $("#place-categories-select");
    const categories = userSession.getObject("categories");
    categories.forEach(function(category) {
      const $categoryOption = $("<option>").html(category.name).attr("value", category.id);
      $categoryOption.appendTo($selectCategories);
    });
    $("#new-place-form").find("input").val("");
    formValidator.initForm("#newPlaceForm", submitNewPlace);
  };

  const setNewPlaceModalClickListener = function() {
    $("#add-new-place").click(initPlaceForm);
  };

  const refreshPlacesContainer = function(response) {
    app.saveCategoriesInStorage(response);
    const choosenCategoryId = userSession.getObject("choosenCategory");
    navbar.displayPlaces(response, choosenCategoryId);
  };

  const refreshContent = function(callback) {
    console.log("TRAtatata")
    apiClient.fetchPlaces(app.savePlacesInStorage, app.logError);
    apiClient.fetchCategories(callback, app.logError)
  };

  const uploadNewPlace = function(imgB64){
    const place = preparePlaceObject(imgB64);
    apiClient.uploadNewPlace(place, app.logError, function(response) {
      app.hideModal("#new-place-modal");
      refreshContent(refreshPlacesContainer);
    });
  };

  const submitNewPlace = function() {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", function() {
      uploadNewPlace(fileReader.result);
    }, false);
    fileReader.readAsDataURL($("input[name=placeImage]").get(0).files[0]);
  };

  const setMapTabClickListener = function() {
    $("#tabs-map").click(function() {
      map.init();
    });
  };

  const setGalleryTabClickListener = function() {
    $("#tabs-gallery").click(function() {
      const $gallery = $("#gallery-card-container");
      prepareCardsWithImages($gallery);
    });
  };

  const setAddRateClickListener = function() {
    $("#create-review-modal").click(function() {
      $("#rate-select").find("input").attr("checked", false);
      $("#rate-content").val("");
    })
  };

  const setOnClickListeners = function() {
    setNewPlaceModalClickListener();
    setMapTabClickListener();
    setAddRateClickListener();
    setGalleryTabClickListener();
  };

  const removeCardsWithPlaces = function (id) {
    $(id).children().remove();
  };

  const prepareCardsWithPlaces = function ($placeContainer) {
    removeCardsWithPlaces("#place-card-container");
    var places = getPlacesByCategory();
    var $row;
    places.forEach(function (place, index) {
      if ((index % CARDS_IN_ROW) === 0) {
        $row = createRowForCard();
      }
      const $column = createColumnForCard();
      const $placeCard = createPlaceCard();
      addPlaceInfoToCard($placeCard, place);
      $column.appendTo($row);
      $placeCard.appendTo($column);
      $row.appendTo($placeContainer);
    });
  };

  const prepareCardsWithImages = function($imageContainer) {
    removeCardsWithPlaces("#gallery-card-container");
    var places = getPlacesByCategory();
    var $row;
    places.forEach(function (place, index) {
      if ((index % CARDS_IN_ROW) === 0) {
        $row = createRowForCard();
      }
      const $column = createColumnForCard();
      const $placeCard = createPlaceCard();
      $("<h4>").text(place.name).appendTo($placeCard);
      addImageToPlaceCard($placeCard, place);
      $column.appendTo($row);
      $placeCard.appendTo($column);
      $row.appendTo($imageContainer);
    });
  };

  const addImageToPlaceCard = function($placeCard, place) {
    const imgSrc = ROOT_URL + place.picture_url;
    const $lightBox = $("<a>").attr("href", imgSrc);
    $lightBox.addClass("img-thumbnail");
    $lightBox.attr("data-lightbox", place.name);
    $lightBox.attr("data-title", place.name);
    $lightBox.appendTo($placeCard);    

    const $img = $("<img>").attr("src", imgSrc);
    $img.addClass("gallery-place-img");
    $img.appendTo($lightBox);
  };

  const addPlaceInfoToCard = function ($card, place) {
    const placeImgSrc = resolveCardImgSrc(place.category_id);
    const imgSrc = ROOT_URL + place.picture_url;
    const category = getCategoryById(place.category_id);
    $("<img>", {src: imgSrc, width: "100px", height: "100px"})
      .addClass("img-circle").appendTo($card);
    $("<h2>").text(place.name).appendTo($card);
    $("<small>").text(category.name).appendTo($card);
    $("<h4>").text(place.location.address).appendTo($card);
    addRateHolder($card, place);
  };

  const addRateHolder = function ($card, place) {
    const id = place.id;
    const $rateHolder = $('<div data-toggle="modal" data-target="#rates-modal" data-placeid="'+place.id+'">');
    $rateHolder.attr("id", "rate-holder" + place.id);
    $rateHolder.data("placeid", place.id);
    const $rates = $('<select>').appendTo($rateHolder);
    for (var i = 0; i < 5; i++) {
      $('<option value=' + (i + 1) + '>').text(i + 1).appendTo($rates);
    }
    $rates.barrating({
      theme: 'fontawesome-stars-o',
      initialRating: place.rate,
      readonly: true
    });
    $rateHolder.click(showPlaceReviewsModal).appendTo($card);
  };

  const formatDate = function(date) {
    return moment(date).format("dddd, d MMMM YYYY HH:mm");
  };

  const showReviews = function(reviews) {
    const $container = $("#reviews-container");
    $container.empty();
    reviews.forEach(function (rev) {
      const $revBox = $("<div>").addClass("review-box");
      const $revRate = $("<div>").addClass("review-rate").appendTo($revBox);
      const $revContent = $("<div>").addClass("review-content").appendTo($revBox);
      const $revAuthor = $("<div>").addClass("review-author").appendTo($revBox);
      const $revDate = $("<div>").addClass("review-date").appendTo($revBox);

      $revRate.text(rev.rate);
      $revContent.text(rev.content);
      $revAuthor.text(rev.username);
      $revDate.text(formatDate(rev.created_at));

      const currentUsername = userSession.getObject("username");
      if(currentUsername === rev.username) {
        const $revRemove = $("<div>").addClass("rev-btn").appendTo($revBox);
        $revRemove.text("Usuń");
        $revRemove.click(function() {
          removeReview(rev.id);
        });

        const $revEdit = $("<div>").addClass("rev-btn").appendTo($revBox);
        $revEdit.text("Edytuj");
        $revEdit.attr("data-toggle", "modal");
        $revEdit.attr("data-target", "#create-rate-modal");
        $revEdit.click(function() {
          editReview(rev);
        })
      }
      $revBox.appendTo($container);
    })
  };

  const editReview = function(review) {
    $("#rateContent").val(review.content);
    $("#rateSelect").find("input").each(function() {
      if(parseInt($(this).val()) === parseInt(review.rate)) {
        $(this).attr("checked", true);
      }
    });
    formValidator.initForm("#create-rate-form", function() {
      const rev = prepareReviewForEdit(review.id);
      sendReview(rev, false);
    });
  };

  const removeReview = function(id) {
    const user = userSession.getUser();
    apiClient.removeReview(id, user, app.logError, refreshReviews);
  };

  const refreshReviews = function() {
    const placeId = userSession.getObject("placeId");
    apiClient.fetchPlaceReviews(placeId, showReviews, app.logError);
  };

  const showPlaceReviewsModal = function (event) {
    const placeId = $(event.currentTarget).data("placeid");
    userSession.saveObject(placeId, "placeId");
    apiClient.fetchPlaceReviews(placeId, showReviews, app.logError);

    if(userSession.isUserLogged()) {
      $("#rate-form-place-id").attr("val", placeId);
      showAddRateBtnAttr();
      formValidator.initForm("#create-rate-form", function() {
        const review = prepareReview();
        sendReview(review, true);
      });
    }
  };

  const prepareReview = function() {
    return {
      content: $("#rateContent").val(),
      rate: $("input[name=rateMark]:checked").val(),
      placeId: $("#rate-form-place-id").attr("val")
    };
  };

  const prepareReviewForEdit = function(reviewId) {
    return {
      content: $("#rateContent").val(),
      rate: $("input[name=rateMark]:checked").val(),
      id: reviewId
    }
  };

  const processAfterReviewUpload = function() {
    $("#create-rate-modal").modal("hide");
    refreshReviews();
  };

  const sendReview = function(review, create) {
    console.log(review);
    const user = userSession.getUser();
    if(create) {
      apiClient.addReview(review, user, processAfterReviewUpload, app.logError);
    } else {
      apiClient.editReview(review, user, app.logError, processAfterReviewUpload);
    }
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

  const createRowForCard = function () {
    return $("<div/>").addClass("row");
  };

  const createColumnForCard = function () {
    return $("<div>").addClass("col-md-4");
  };

  const createPlaceCard = function () {
    return $("<div>").addClass("place-card text-center");
  };

  const getPlacesByCategory = function() {
    var places = userSession.getObject("places");
    const choosenCategoryId = userSession.getObject("choosenCategory");
    if (choosenCategoryId === -1) {
      return places;
    }
    return places.filter(function (place) {
      if (place.category_id === choosenCategoryId) {
        return place;
      }
    });
  };

  const getCategoryById = function (categoryID) {
    const categories = userSession.getObject("categories");
    return categories.filter(function (c) {
      if (c.id === categoryID) {
        return c;
      }
    })[0];
  };

  const init = function() {
    setOnClickListeners();
  };

  return {
    removeCardsWithPlaces: removeCardsWithPlaces,
    prepareCardsWithImages: prepareCardsWithImages,
    prepareCardsWithPlaces: prepareCardsWithPlaces,
    init: init
  }
})();
