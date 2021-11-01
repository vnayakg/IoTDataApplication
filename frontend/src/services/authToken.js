import jwtDecode from 'jwt-decode';

const authTokenKey = 'AuthToken';

const methods = {
  getToken: () => localStorage.getItem(authTokenKey),
  setToken: (token) => localStorage.setItem(authTokenKey, token),
  removeToken: () => localStorage.removeItem(authTokenKey),

  getUser: function () {
    try {
      const jwt = this.getToken();
      return jwtDecode(jwt);
    } catch {
      return null;
    }
  },
};

export default methods;
