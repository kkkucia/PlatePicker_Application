import axios from "axios";
import AuthService from "./AuthService";

const url = "http://127.0.0.1:9001";

const ApiService = {
  getMealTags: () => {
    const token = AuthService.getToken();
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/meals/tags`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data.detail));
    });
  },

  getSimilarMeals: (searchQuery) => {
    const token = AuthService.getToken();
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/meals/similar?search_query=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data.detail));
    });
  },

  getMealNutrition: async (meal, quantity) => {
    const token = AuthService.getToken();
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/meals/${meal}/${quantity}/nutrition`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data.detail);
        });
    });
  },

  getMealsPlanForAllDay: () => {
    const token = AuthService.getToken();
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/meals/plan`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data.detail));
    });
  },

  getRecipe: (meal) => {
    const token = AuthService.getToken();
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/meals/${meal}/recipe`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data.detail));
    });
  },

  getRecipeIngredients: (meal) => {
    const token = AuthService.getToken();
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/meals/${meal}/recipe/ingredients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data.detail));
    });
  },

  getMealInspiration: (searchQuery = null, tag = null) => {
    const token = AuthService.getToken();
    const searchQueryUrl = searchQuery ? `search_query=${searchQuery}` : "";
    const tagUrl = tag ? `tag=${tag}` : "";
    const and = tag && searchQuery ? "&" : "";

    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/meals/inspiration?${searchQueryUrl}${and}${tagUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data.detail));
    });
  },
};
export default ApiService;
