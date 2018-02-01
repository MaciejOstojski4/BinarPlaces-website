const app = (function () {

  const setDateInFooter = function () {
    const date = new Date();
    $("#copyrightInfo").text("Copyright " + date.getFullYear());
  };

  const hideElementOnStart = function () {
    $("#content").hide();
    $("#loader").hide();
  };

  const initLocalStorage = function() {
    apiClient.fetchPlaces()
      .then(function(response) {
        userSession.saveObject(response, "places");
      })
      .catch(function(error) {
        console.log(error);
      });

    apiClient.fetchCategories()
      .then(function(response) {
        userSession.saveObject(response, "categories")
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      })
  };

  const init = function () {
    changeLoginState();
    initLocalStorage();
    setOnClickListeners();
    placesContainer.init();

    const loginForm = $("#loginForm");
    loginForm.submit(login);

    const registerForm = $("#registerForm");
    registerForm.submit(register);

    setDateInFooter();
    hideElementOnStart();
    const categories = userSession.getObject("categories");
    navbar.prepareNavbar(categories);
  };

  const login = function (e) {
    e.preventDefault();
    const data = $("#loginForm").serialize();
    const email = $("#emailLoginInput").val();
    apiClient.login(data)
      .then(function (response) {
        userSession.setUser(email, response.auth_token);
        changeLoginState();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const changeLoginState = function() {
    if(localStorage.getItem("email") !== null) {
      showLogout();
    } else {
      showLogin();
    }
  };

  const showLogout = function() {
    $("#logout").css("display", "block");
    $("#login-register").css("display", "none");
  };

  const showLogin = function() {
    $("#logout").css("display", "none");
    $("#login-register").css("display", "block");
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

  const setOnClickListeners = function() {
    setLogoutClickListner();
  };

  const setLogoutClickListner = function() {
    $("#logout").click(logout);
  };

  const logout = function() {
    userSession.clearSession();
    changeLoginState();
  };

  return {
    init: init,
  }
})();

$(function () {
  app.init();
});
