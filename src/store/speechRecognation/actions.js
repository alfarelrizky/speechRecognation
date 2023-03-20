import axios from 'axios'

export const getList = async ({ getters, rootGetters, commit }) => {
  debugger
  try {
    const search = getters.getSearch;

    let temp = search ? encodeURI(search) : "a";
    let res;
    if (search) {
      res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=6dd7f2aaa8fe5b6a283d5b2a00a19a1b&language=en-US&query=${temp}&include_adult=false`)
    } else {
      res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=6dd7f2aaa8fe5b6a283d5b2a00a19a1b&language=en-US&page=1`)
    }

    if (res.status === 200) {
      commit("setResult", res.data.results);
    } else {
      commit("setResult", []);
    }
    return res;
  } catch (err) {
    throw err;
  }
};

export const getDetailMovie = async ({ getters, rootGetters, commit }, id) => {
  try {
    let res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=6dd7f2aaa8fe5b6a283d5b2a00a19a1b&language=en-US`)
    let resCast = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=6dd7f2aaa8fe5b6a283d5b2a00a19a1b&language=en-US`)

    if (res.status === 200 && resCast.status === 200) {
      commit("setDetail", res.data);
      commit("setCast", resCast.data.cast);
    } else {
      commit("setDetail", {});
      commit("setCast", {});
    }
    return res;
  } catch (err) {
    throw err;
  }
};