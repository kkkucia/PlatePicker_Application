import axios from "axios";

const url = "http://127.0.0.1:9001";

const AuthService = {
  registerUser: (userData) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}/register`, userData)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data.detail);
        });
    });
  },

  loginUser: (userData) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}/login`, userData)
        .then((response) => {
          document.cookie = `open_token=${response.data.token}; SameSite=Strict; Secure`;
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data.detail);
        });
    });
  },

  logoutUser: () => {
    return new Promise((resolve, reject) => {
      try {
        document.cookie = "open_token=; Max-Age=0;";
        resolve();
      } catch (error) {
        reject("Error while logging out");
      }
    });
  },

  unregisterUser: (userData) => {
    return new Promise((resolve, reject) => {
      try {
        const token = AuthService.getToken();

        axios
          .delete(`${url}/unregister`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: userData,
          })
          .then(() => {
            document.cookie = "open_token=; Max-Age=0;";
            resolve();
          })
          .catch((error) => {
            reject(error.response.data.detail);
          });
      } catch (error) {
        reject("Error while logging out");
      }
    });
  },

  getToken: () => {
    if (!document.cookie){
      return null
    }
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("open_token"))
      .split("=")[1];
  },
};

export default AuthService;
