const apiClient = (function () {

  const ROOT_URL = "http://taste-api.binarlab.com";

  const API_URL = "http://taste-api.binarlab.com/api/v1/";

  const CATEGORIES_PATH = "categories",
    PLACES_PATH = "places/",
    USER_PATH = "user/",
    LOGIN_PATH = "user/sign_in/",
    REGISTER_PATH = "user/sign_up/",
    REVIEWS_PATH = "reviews/",
    CREATE_REVIEW_PATH = "/reviews#create",
    CREATE_PLACE_PATH = "places#create";

  const uploadNewPlace = function(place, callback, errCallback) {
    return $.ajax({
      type: "POST",
      url: API_URL + CREATE_PLACE_PATH,
      data: place,
      headers: {
        "X-User-Token": userSession.getUser().auth_token,
        "X-User-Email": userSession.getUser().email
      }
    })
      .then(callback)
      .catch(errCallback);
  };

  const fetchCategories = function (callback, errCallback) {
    $.ajax({
      type: "GET",
      url: API_URL + CATEGORIES_PATH
    })
      .then(callback)
      .catch(errCallback);
  };

  const fetchPlaces = function (callback, errCallback) {
    $.ajax({
      type: "GET",
      url: API_URL + PLACES_PATH
    })
      .then(callback)
      .catch(errCallback);
  };

  const fetchPlaceReviews = function (placeID, callback, errCallback) {
    $.ajax({
      type: "GET",
      url: API_URL + PLACES_PATH + placeID + "/" + REVIEWS_PATH
    })
      .then(callback)
      .catch(errCallback);
  };

  const removeReview = function(id, user, callback, errCallback) {
    $.ajax({
      type: "DELETE",
      url: API_URL + REVIEWS_PATH + id + "#destroy",
      headers: {
        "X-User-Token": user.auth_token,
        "X-User-Email": user.email
      }
    })
      .then(callback)
      .catch(errCallback);
  };

  const fetchPlaceImage = function (imgUrl) {
    return $.ajax({
      type: "GET",
      url: ROOT_URL + imgUrl
    })
  };

  const login = function (user, callback, errCallback) {
    $.ajax({
      type: "POST",
      url: API_URL + LOGIN_PATH,
      data: user
    })
      .then(callback)
      .catch(errCallback);
  };

  const getUserData = function(user, callback, errCallback) {
    $.ajax({
      type: "GET",
      url: API_URL + USER_PATH,
      headers: {
        "X-User-Token": user.auth_token,
        "X-User-Email": user.email
      }
    })
      .then(callback)
      .catch(errCallback);
  };

  const register = function (user, callback, errCallback) {
    return $.ajax({
      type: "POST",
      url: API_URL + REGISTER_PATH,
      data: user
    })
      .then(callback)
      .catch(errCallback);
  };

  const addReview = function(review, user, callback, errCallback) {
    const rev = {
      content: review.content,
      rate: review.rate
    };

    return $.ajax({
      type: "POST",
      url: API_URL + PLACES_PATH + review.placeId + CREATE_REVIEW_PATH,
      data: rev,
      headers: {
        "X-User-Token": user.auth_token,
        "X-User-Email": user.email
      }
    })
      .then(callback)
      .catch(errCallback);
  };

  const editReview = function(review, user, callback, errCallback) {
    const rev = {
      content: review.content,
      rate: review.rate
    };

    $.ajax({
      type: "PUT",
      url: API_URL + REVIEWS_PATH + review.id + "#update",
      data: rev,
      headers: {
        "X-User-Token": user.auth_token,
        "X-User-Email": user.email
      }
    })
      .then(callback)
      .catch(errCallback);
  };

  return {
    fetchCategories: fetchCategories,
    fetchPlaces: fetchPlaces,
    fetchPlaceReviews: fetchPlaceReviews,
    login: login,
    register: register,
    addReview: addReview,
    fetchPlaceImage: fetchPlaceImage,
    uploadNewPlace: uploadNewPlace,
    getUserData: getUserData,
    removeReview: removeReview,
    editReview: editReview
  }
})();
