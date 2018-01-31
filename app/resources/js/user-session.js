const userSession = (function() {

  const setUser = function(email, authToken) {
    localStorage.setItem("auth_token", authToken);
    localStorage.setItem("email", email);
  };

  const obtainUser = function() {
    return {
      email: localStorage.getItem("email"),
      auth_token: localStorage.getItem("auth_token")
    }
  };

  const isUserLogged = function() {
    return localStorage.getItem("email");
  };

  const clearSession = function() {
    localStorage.clear();
  };

  return {
    setUser: setUser,
    obtainUser: obtainUser,
    isUserLogged: isUserLogged,
    clearSession: clearSession
  }
})();
