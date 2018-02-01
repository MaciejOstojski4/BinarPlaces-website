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
    userSession.saveObject(response, "places");
  };

  const saveCategoriesInStorage = function(response) {
    userSession.saveObject(response, "categories");
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
  };

  const init = function () {
    initLocalStorage(initUI);
  };

  const processAfterLogin = function(email, response) {
    userSession.setUser(email, response.auth_token);
    showUserSessionElem();
    hideModal("#loginModal")
  };

  const login = function (e) {
    e.preventDefault();
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

  const setOnClickListeners = function() {
    setLogoutClickListner();
    setLoginClickListener();
    setRegisterClickListener();
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

  const logout = function() {
    userSession.clearSession();
    showUserSessionElem();
  };

  return {
    init: init
  }
})();

$(function () {
  app.init();
});
