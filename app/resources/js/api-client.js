const apiClient = (function () {

  const ROOT_URL = "http://taste-api.binarlab.com";

  const API_URL = "http://taste-api.binarlab.com/api/v1/";

  const CATEGORIES_PATH = "categories",
    PLACES_PATH = "places/",
    LOGIN_PATH = "user/sign_in/",
    REGISTER_PATH = "user/sign_up/",
    REVIEWS_PATH = "/reviews/",
    CREATE_REVIEW_PATH = "/reviews#create",
    CREATE_PLACE_PATH = "places#create";

  const uploadNewPlace = function(place) {
    return $.ajax({
      type: "POST",
      url: API_URL + CREATE_PLACE_PATH,
      data: place,
      headers: {
        "X-User-Token": "4WqKT3yVdYwq7NKe6Tym",
        "X-User-Email": "binar_taste@example.com",
      }
    });
  };

  const fetchCategories = function () {
    return $.ajax({
      type: "GET",
      url: API_URL + CATEGORIES_PATH
    });
  };

  const fetchPlaces = function () {
    return $.ajax({
      type: "GET",
      url: API_URL + PLACES_PATH
    });
  };

  const fetchPlaceReviews = function (placeID) {
    return $.ajax({
      type: "GET",
      url: API_URL + PLACES_PATH + placeID + REVIEWS_PATH
    });
  };

  const fetchPlaceImage = function (imgUrl) {
    return $.ajax({
      type: "GET",
      url: ROOT_URL + imgUrl
    })
  };

  const login = function (user) {
    console.log(user);
    return $.ajax({
      type: "POST",
      url: API_URL + LOGIN_PATH,
      data: user
    })
  };

  const register = function (user) {
    return $.ajax({
      type: "POST",
      url: API_URL + REGISTER_PATH,
      data: user
    })
  };

  const addReview = function(review, user) {
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
  };

  return {
    fetchCategories: fetchCategories,
    fetchPlaces: fetchPlaces,
    fetchPlaceReviews: fetchPlaceReviews,
    login: login,
    register: register,
    addReview: addReview,
    fetchPlaceImage: fetchPlaceImage,
    uploadNewPlace: uploadNewPlace
  }
})();
