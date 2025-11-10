const endpointUrl =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_API
    : "http://localhost:3001";

class ApiDb {
  constructor({ baseUrl }) {
    this._apiurl = baseUrl;
    this._options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  _genericFetch({ method = "GET", endpoint, token, body }) {
    const fetchOptions = { ...this._options, method };
    if (body) fetchOptions.body = JSON.stringify(body);
    if (token) fetchOptions.headers.authorization = `Bearer ${token}`;
    return fetch(`${this._apiurl}/${endpoint}`, fetchOptions).then((result) => {
      if (result.ok) {
        return result.json();
      }
      return Promise.reject(`Error: ${result.status}`);
    });
  }

  getIngredients(endpoint = "recipes/list.php?i=list") {
    return this._genericFetch({ endpoint });
  }

  getRecipesByIngredient(endpoint) {
    return this._genericFetch({
      endpoint: `recipes/filter.php?i=${endpoint}`,
    });
  }

  getRecipeByID(endpoint) {
    return this._genericFetch({
      endpoint: `recipes/lookup.php?i=${endpoint}`,
    });
  }

  getRandomRecipe() {
    return this._genericFetch({
      endpoint: "recipes/random.php",
    });
  }

  updateUserProfile(token, body) {
    return this._genericFetch({
      method: "PATCH",
      endpoint: "users/me",
      token,
      body,
    });
  }

  getFavorites(token) {
    return this._genericFetch({ endpoint: `favorites`, token });
  }

  addFavorite(token, body) {
    return this._genericFetch({
      method: "POST",
      endpoint: `favorites`,
      body,
      token,
    });
  }

  removeFavorite(token, body) {
    return this._genericFetch({
      method: "DELETE",
      endpoint: `favorites`,
      body,
      token,
    });
  }
}

export const getApiDb = () =>
  new ApiDb({
    baseUrl: endpointUrl,
  });
