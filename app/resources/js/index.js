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
        console.log(error);
      });
  };

  const login = function (e) {
    e.preventDefault();
    const data = $("#loginForm").serialize();
    const email = $("#emailLoginInput").val();
    apiClient.login(data)
      .then(function (response) {
        console.log(response);
        userSession.setUser(email, response.auth_token);
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
