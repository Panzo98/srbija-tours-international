import { combineReducers } from "redux";
import authReducer from "./authReducers";
import passengersReducer from "./passengersReducer";
import searchReducer from "./searchReducer";
import connectionReducer from "./connectionReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  passengersReducer,
  searchReducer,
  connectionReducer,
});

export default rootReducer;
