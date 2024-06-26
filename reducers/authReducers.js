const initialState = {
  isAuthenticated: false,
  user: {},
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      console.log(action.payload);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };
    case "RESTORE_SESSION":
      console.log(action.payload);

      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    default:
      return state;
  }
}

export default authReducer;
