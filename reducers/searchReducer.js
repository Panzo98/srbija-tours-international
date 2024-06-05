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
  passengers: [
    { count: 0, categoryId: 2, label: "Bebe 0-2", shortLabel: "Bebe" },
    { count: 0, categoryId: 3, label: "Deca 3-12", shortLabel: "Deca" },
    { count: 0, categoryId: 4, label: "Mladi 13-26", shortLabel: "Mladi" },
    { count: 0, categoryId: 1, label: "Odrasli 27-60", shortLabel: "Odrasli" },
    { count: 0, categoryId: 5, label: "Stariji 60+", shortLabel: "Stariji" },
  ],
  passengersFullInfo: [],
  email: "aco.panzalovic@gmai.com",
  tickets: [],
};

function searchReducer(state = initialState, action) {
  switch (action.type) {
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
    case "PASSENGER_INCREMENT": {
      const newPassengers = state.passengers.map((passenger) => {
        if (passenger.categoryId === action.payload) {
          return { ...passenger, count: passenger.count + 1 };
        }
        return passenger;
      });
      return { ...state, passengers: newPassengers };
    }
    case "PASSENGER_DECREMENT": {
      const newPassengers = state.passengers.map((passenger) => {
        if (passenger.categoryId === action.payload) {
          return { ...passenger, count: Math.max(passenger.count - 1, 0) };
        }
        return passenger;
      });
      return { ...state, passengers: newPassengers };
    }
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
    case "RESET_PASSENGERS_INFO":
      return {
        ...state,
        passengersFullInfo: [],
      };
    case "UPDATE_PASSENGER_INFO": {
      const updatedPassengersInfo = [...state.passengersFullInfo];
      updatedPassengersInfo[action.payload.index] = action.payload.data;
      return {
        ...state,
        passengersFullInfo: updatedPassengersInfo,
      };
    }
    case "ASSIGN_RESERVATION_IDS_TO_PASSENGERS": {
      const reservationIds = action.payload;
      const updatedPassengers = state.passengersFullInfo.map(
        (passenger, index) => {
          const reservationId = reservationIds[index];
          return {
            ...passenger,
            reservationId,
            qrCode: `https://drivesoft-srbijatours.com/ticket/show?booking_number=${reservationId}`,
          };
        }
      );
      return {
        ...state,
        passengersFullInfo: updatedPassengers,
      };
    }
    case "UPDATE_PASSENGER_QR_CODE": {
      const updatedPassengersInfo = [...state.passengersFullInfo];
      updatedPassengersInfo[action.payload.index].qrCode =
        action.payload.qrCode;
      return {
        ...state,
        passengersFullInfo: updatedPassengersInfo,
      };
    }
    case "RESET_PASSENGERS_COUNT":
      return {
        ...state,
        passengers: [
          { count: 0, categoryId: 2, label: "Bebe 0-2", shortLabel: "Bebe" },
          { count: 0, categoryId: 3, label: "Deca 3-12", shortLabel: "Deca" },
          {
            count: 0,
            categoryId: 4,
            label: "Mladi 13-26",
            shortLabel: "Mladi",
          },
          {
            count: 0,
            categoryId: 1,
            label: "Odrasli 27-60",
            shortLabel: "Odrasli",
          },
          {
            count: 0,
            categoryId: 5,
            label: "Stariji 60+",
            shortLabel: "Stariji",
          },
        ],
      };
    case "ADD_RESERVATION_IDS":
      return {
        ...state,
        reservationIds: [...action.payload],
      };
    case "RESET_REDUCER":
      return { state: initialState };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "DISABLE_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export default searchReducer;
