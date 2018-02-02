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

  const saveObject = function(object, key) {
    if(localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
    }
    localStorage.setItem(key, JSON.stringify(object));
  };

  const getObject = function(key) {
    return JSON.parse(localStorage.getItem(key));
  };

  return {
    setUser: setUser,
    getUser: obtainUser,
    isUserLogged: isUserLogged,
    clearSession: clearSession,
    saveObject: saveObject,
    getObject: getObject
  }
})();
