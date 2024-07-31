const initialState = {
  loading: false,
  id_departure: null,
  paymentMethod: 1,
  direction: 1,
  departure: { id: null, value: null },
  destination: { id: null, value: null },
  departureDate: null,
  returnDate: null,
  total: null,
  email: "",
  tickets: [],
  passengersForBackend: [], // salju se u formatu [4,4,2,1,6]
  originalPassengersFullInfo: [], // salju se orginalni passCatPriceSr
  editedPassengersInfo: [], // editovani passCatPriceSr gdje dodajemo firstName, lastName, phone, birthday
};

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_PASSENGERS_INFO":
      console.log("OVO JE UPDATE ZA PASSENGERS INFO", action.payload);
      return {
        ...state,
        originalPassengersFullInfo: action.payload,
      };
    case "RESET_PASSENGERS_INFO":
      return {
        ...state,
        originalPassengersFullInfo: [],
      };
    case "UPDATE_PASSENGERS_FULL_INFO":
      return {
        ...state,
        editedPassengersInfo: [...action.payload],
      };
    case "SET_DEPARTURE":
      return {
        ...state,
        departure: { id: action.payload.id, value: action.payload.value },
      };
    case "REMOVE_DEPARTURE":
      return {
        ...state,
        departure: { id: null, value: null },
      };
    case "SET_TICKETS":
      return {
        ...state,
        tickets: action.payload,
      };
    case "ADD_TICKETS":
      return {
        ...state,
        tickets: {
          ...action.payload,
          data: [...state.tickets.data, ...action.payload.data],
        },
      };
    case "REMOVE_TICKETS":
      return {
        ...state,
        tickets: [],
      };
    case "SET_DESTINATION":
      return {
        ...state,
        destination: { id: action.payload.id, value: action.payload.value },
      };
    case "REMOVE_DESTINATION":
      return {
        ...state,
        destination: { id: null, value: null },
      };
    case "SET_DEPARTURE_DATE":
      return {
        ...state,
        departureDate: action.payload,
      };
    case "SET_DIRECTION":
      return {
        ...state,
        direction: action.payload,
      };
    case "REMOVE_DEPARTURE_DATE":
      return {
        ...state,
        departureDate: null,
      };
    case "SET_RETURN_DATE":
      return {
        ...state,
        returnDate: action.payload,
      };
    case "REMOVE_RETURN_DATE":
      return {
        ...state,
        returnDate: null,
      };
    case "RESET_PASSENGERS_FOR_BACKEND":
      return {
        ...state,
        passengersForBackend: [],
      };
    case "ADD_PASSENGER_FOR_BACKEND":
      return {
        ...state,
        passengersForBackend: [...state.passengersForBackend, action.payload],
      };
    case "REMOVE_PASSENGER_FOR_BACKEND": {
      const index = state.passengersForBackend.indexOf(action.payload);
      if (index === -1) return state;

      const updatedPassengers = [...state.passengersForBackend];
      updatedPassengers.splice(index, 1);

      return {
        ...state,
        passengersForBackend: updatedPassengers,
      };
    }
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "REMOVE_EMAIL":
      return {
        ...state,
        email: null,
      };
    case "SELECT_LINE":
      return {
        ...state,
        id_departure: action.payload.id_departure,
        total: action.payload.total,
      };
    case "DESELECT_LINE":
      return {
        ...state,
        id_departure: null,
        total: null,
      };
    case "ADD_RESERVATION_IDS":
      return {
        ...state,
        reservationIds: [...action.payload],
      };
    case "RESET_REDUCER":
      return initialState;
    case "SET_LOADING":
      return { ...state, loading: true };
    case "DISABLE_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export default searchReducer;
