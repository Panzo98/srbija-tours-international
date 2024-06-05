const initialState = {
  connected: false,
  user: {},
  token: null,
  tickets: [],
};

function connectionReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_ONLINE_MODE":
      return {
        ...state,
        connected: true,
      };
    case "SET_OFFLINE_MODE":
      return {
        connected: false,
        user: action.payload.user,
        token: action.payload.token,
        tickets: action.payload.tickets,
      };
    default:
      return state;
  }
}

export default connectionReducer;
