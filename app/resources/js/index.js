const app = (function () {

  const logError = function(error) {
    console.log(error);
  };

  const setDateInFooter = function () {
    const date = new Date();
    $("#copyrightInfo").text("Copyright " + date.getFullYear());
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
    if (first.count > second.count) {
      return -1;
    } else if (first.count < second.count) {
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
    setDateInFooter();
    navbar.init();
    placesContainer.init();

    initLoginForm();
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
    hideModal("#loginModal");
  };

  const login = function () {
    const data = $("#loginForm").serialize();
    const email = $("#emailLoginInput").val();
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

  const register = function (e) {
    e.preventDefault();
    const data = $("#registerForm").serialize();
    apiClient.register(data, function(response) {
      hideModal("#registerModal")
    }, logError)
  };

  const hideModal = function(id) {
    $(id).modal("hide");
  };

  const initLoginForm = function() {
    formValidator.initForm("#loginForm", login);
  };

  const setOnClickListeners = function() {
    setLogoutClickListner();
    // setLoginClickListener();
    setRegisterClickListener();
    setTabsClickListener();
  };

  const setLogoutClickListner = function() {
    $("#logout").click(logout);
  };

  const setLoginClickListener = function() {
    $("#loginForm").submit(login);
  };

  const setRegisterClickListener = function() {
    $("#registerForm").submit(register);
  };

  const setTabsClickListener = function() {
    $(".content-tabs-item-link").click(function() {
      const $tab = $(this);
      $tab.closest("ul").find(".tabs-link-active").removeClass("tabs-link-active");
      $tab.addClass("tabs-link-active");
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
    hideModal: hideModal
  }
})();

$(function () {
  app.init();
});
