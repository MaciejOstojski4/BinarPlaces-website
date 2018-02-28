const app = (function () {

  const logError = function(error) {
    console.log(error);
    alert("Something went wrong, try again");
  };

  const setDateInFooter = function () {
    const date = new Date();
    $("#copyright-info").text("Copyright " + date.getFullYear());
  };

  const hideElementOnStart = function () {
    $("#main-content").hide();
    $("#loader-section").hide();
  };

  const savePlacesInStorage = function(response) {
    const sortedPlaces = response.sort(sortPlacesByRate);
    userSession.saveObject(sortedPlaces, "places");
  };

  const saveCategoriesInStorage = function(response) {
    const sortedCategories = response.sort(sortCategoriesByCount);
    userSession.saveObject(sortedCategories, "categories");
  };

  const sortCategoriesByCount = function (first, second) {
    if (first.places_count > second.places_count) {
      return -1;
    } else if (first.places_count < second.places_count) {
      return 1;
    } else {
      return 0;
    }
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

  const initLocalStorage = function(callback) {
    apiClient.fetchPlaces(savePlacesInStorage, logError);
    apiClient.fetchCategories(callback, logError);
  };

  const initUI = function(response) {
    saveCategoriesInStorage(response);
    hideElementOnStart();
    showUserSessionElem();
    setOnClickListeners();
    initFormsValidators();
    setDateInFooter();
    navbar.init();
    placesContainer.init();
  };

  const init = function () {
    initLocalStorage(initUI);
  };

  const saveUserData = function(response) {
    userSession.saveObject(response.name, "username");
    userSession.saveObject(response.id, "userID");
  };

  const processAfterLogin = function(email, response) {
    userSession.setUser(email, response.auth_token);
    showUserSessionElem();
    const user = userSession.getUser();
    apiClient.getUserData(user, saveUserData, logError);
    hideModal("#login-modal");
  };

  const login = function () {
    const data = $("#login-form").serialize();
    const email = $("#email-login-input").val();
    apiClient.login(data, function(response) {
      processAfterLogin(email, response);
    }, logError)
  };

  const showUserSessionElem = function() {
    if(userSession.isUserLogged()) {
      showLoggedInUserElem();
    } else {
      showLoggedOutUserElem();
    }
  };

  const showLoggedInUserElem = function() {
    $("#logout").css("display", "block");
    $("#login-register").css("display", "none");
    $("#add-new-place").css("display", "block");
  };

  const showLoggedOutUserElem = function() {
    $("#logout").css("display", "none");
    $("#login-register").css("display", "block");
  };

  const register = function () {
    const data = $("#register-form").serialize();
    apiClient.register(data, function(response) {
      hideModal("#register-modal")
    }, logError)
  };

  const hideModal = function(id) {
    $(id).modal("hide");
  };

  const initFormsValidators = function() {
    initLoginForm();
    initRegisterForm();
  };

  const initRegisterForm = function() {
    formValidator.initForm("#register-form", register);
  };

  const initLoginForm = function() {
    formValidator.initForm("#login-form", login);
  };

  const setOnClickListeners = function() {
    setLogoutClickListner();
    setTabsClickListener();
  };

  const setLogoutClickListner = function() {
    $("#logout").click(logout);
  };

  const setTabsClickListener = function() {
    $(".nav-tabs-link").click(function() {
      const $tab = $(this);
      console.log($tab.closest("ul").find(".nav-tabs-link--active"));
      $tab.closest("ul").find(".nav-tabs-link--active").removeClass("nav-tabs-link--active").addClass("nav-tabs-link");
      $tab.addClass("nav-tabs-link--active").removeClass("nav-tabs-link");
    })
  };

  const logout = function() {
    userSession.clearSession();
    showUserSessionElem();
  };

  return {
    init: init,
    savePlacesInStorage: savePlacesInStorage,
    saveCategoriesInStorage: saveCategoriesInStorage,
    logError: logError,
    hideModal: hideModal,
    sortCategoriesByCount: sortCategoriesByCount
  }
})();

$(function () {
  app.init();
});
