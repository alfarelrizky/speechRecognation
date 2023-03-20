export const setSearch = (state, value) => {
  state.search = value;
};

export const setResult = (state, value) => {
  debugger
  value = value.filter((item) => item.poster_path !== null);
  state.listData = value;
};

export const setDetail = (state, value) => {
  state.detail = value;
};

export const setCast = (state, value) => {
  value = value.filter((item) => item.profile_path !== null);
  state.cast  = value;
};